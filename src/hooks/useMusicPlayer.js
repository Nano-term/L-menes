import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook que controla el reproductor de música ambiental.
 *
 *  - Lee la lista de canciones desde `/music/playlist.json` (servido por public/).
 *  - Reproducción aleatoria sin repetir hasta agotar la lista.
 *  - Avance automático al terminar una canción.
 *  - Sin autoplay: el usuario debe presionar "Activar ambiente" la primera vez.
 *
 * Retorna { ready, isPlaying, volume, currentTrack, activate, toggle, next, setVolume, hasTracks }
 */
export function useMusicPlayer() {
  const audioRef = useRef(null);
  const queueRef = useRef([]); // canciones aún por reproducir en el ciclo
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activated, setActivated] = useState(false); // ¿ya se activó el ambiente?
  const [volume, setVolumeState] = useState(0.55);

  // Crear el elemento <audio> una vez.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => playNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar volumen.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Cargar la playlist.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/music/playlist.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('No se encontró playlist.json');
        const data = await res.json();
        const tracks = Array.isArray(data) ? data : data.tracks || [];
        if (!cancelled) {
          setPlaylist(tracks);
          queueRef.current = shuffle([...tracks]);
        }
      } catch (err) {
        console.warn('[useMusicPlayer] No se pudo cargar la playlist:', err.message);
        if (!cancelled) setPlaylist([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fisher-Yates shuffle.
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pickFromQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle([...playlist]);
    }
    const next = queueRef.current.shift();
    return next || null;
  }, [playlist]);

  const playTrack = useCallback((track) => {
    if (!track || !audioRef.current) return;
    setCurrentTrack(track);
    audioRef.current.src = track.src;
    audioRef.current.play().catch((err) => {
      console.warn('[useMusicPlayer] Reproducción bloqueada:', err.message);
      setIsPlaying(false);
    });
  }, []);

  const playNext = useCallback(() => {
    const next = pickFromQueue();
    if (next) playTrack(next);
  }, [pickFromQueue, playTrack]);

  // Activar el ambiente (primera vez).
  const activate = useCallback(() => {
    if (playlist.length === 0) {
      console.warn('[useMusicPlayer] No hay canciones en la playlist.');
      return;
    }
    setActivated(true);
    playNext();
  }, [playlist, playNext]);

  // Toggle play/pause.
  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (!activated) {
      activate();
      return;
    }
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [activated, activate]);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  }, []);

  return {
    ready: playlist.length > 0,
    activated,
    isPlaying,
    volume,
    currentTrack,
    activate,
    toggle,
    next: playNext,
    setVolume,
    hasTracks: playlist.length > 0,
  };
}
