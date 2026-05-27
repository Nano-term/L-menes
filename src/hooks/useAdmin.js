import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook para el modo administrador (oculto).
 *
 *  - Detecta una secuencia secreta: 3 toques en menos de 1.5 segundos sobre
 *    el "punto" del logo (componente Header).
 *  - Al detectarla, abre el modal de contraseña.
 *  - La contraseña vive en una variable de entorno (VITE_ADMIN_PASSWORD).
 *    Si no se define, cae a un valor por defecto.
 *  - La sesión de admin se guarda en sessionStorage para que dure mientras la
 *    pestaña esté abierta (NO se persisten mensajes, solo el flag de sesión).
 *
 * NOTA DE SEGURIDAD: el chequeo es client-side, no es seguridad robusta.
 * Para un proyecto escolar es suficiente, pero el README documenta las
 * limitaciones y cómo migrar a Supabase Auth si se necesita más rigor.
 */
const SESSION_KEY = 'lumenes:admin';
const TAP_WINDOW_MS = 1500;
const TAPS_NEEDED = 3;

const FALLBACK_PASSWORD = 'holacomoestas69';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const tapsRef = useRef([]);

  // Restaurar sesión al cargar.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') setIsAdmin(true);
    } catch {
      // sessionStorage podría estar bloqueado (modo privado), no pasa nada.
    }
  }, []);

  const registerTap = useCallback(() => {
    const now = Date.now();
    // Filtrar toques fuera de la ventana de tiempo.
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    tapsRef.current.push(now);
    if (tapsRef.current.length >= TAPS_NEEDED) {
      tapsRef.current = [];
      setShowLogin(true);
    }
  }, []);

  const attemptLogin = useCallback((password) => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD || FALLBACK_PASSWORD;
    if (password === expected) {
      setIsAdmin(true);
      setShowLogin(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* noop */
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const closeLogin = useCallback(() => setShowLogin(false), []);

  return {
    isAdmin,
    showLogin,
    registerTap,
    attemptLogin,
    closeLogin,
    logout,
  };
}
