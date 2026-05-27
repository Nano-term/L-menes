# 🎵 Carpeta de música ambiental

Aquí van los archivos `.mp3` que reproducirá el sistema de música ambiental.

## Cómo agregar canciones

1. Coloca tus archivos `.mp3` en esta misma carpeta (`public/music/`).
2. Edita `playlist.json` y agrega una entrada por cada canción:

```json
[
  { "title": "mi cancion linda", "src": "/music/mi-cancion-linda.mp3" }
]
```

- `title` es el nombre que aparece en el reproductor.
- `src` debe empezar con `/music/` (la ruta pública).

## Recomendaciones

- **Formato:** `.mp3` (la mayor compatibilidad). Si usas `.ogg` o `.wav` también funcionan pero pesan más.
- **Duración:** 2-5 minutos por pista funciona bien.
- **Estilo:** lo-fi, ambient, chillhop, post-rock instrumental — música sin voces marcadas funciona mejor de fondo.
- **Tamaño:** intenta que cada archivo sea < 5 MB para que cargue rápido.
- **Licencias:** usa música libre de derechos (Pixabay Music, Free Music Archive, YouTube Audio Library, tus propias composiciones).

## Si no agregas canciones

El reproductor simplemente no aparecerá. La app funciona perfectamente sin música.
