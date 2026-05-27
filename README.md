# 🌙 Lúmenes

> Un muro digital emocional para los maestros de Ingeniería en Software.

Lúmenes es una aplicación full-stack en tiempo real donde los alumnos pueden dejar pensamientos, agradecimientos, recuerdos y mensajes para sus docentes. Diseñada con una estética cozy-cyberpunk: vidrio, gradientes oscuros, partículas y música ambiental.

![Stack](https://img.shields.io/badge/React-18-7ee8fa) ![Vite](https://img.shields.io/badge/Vite-5-a78bfa) ![Tailwind](https://img.shields.io/badge/Tailwind-3-88d3ce) ![Supabase](https://img.shields.io/badge/Supabase-realtime-6d5acd) ![Netlify](https://img.shields.io/badge/Netlify-deploy-ffc1d6)

---



## 📂 Estructura del proyecto

```
muro-emocional/
├── public/
│   ├── favicon.svg                  # Ícono del sitio
│   └── music/
│       ├── playlist.json            # Lista de canciones
│       ├── README.md                # Cómo agregar música
│       └── *.mp3                    # Tus canciones (tú las pones)
│
├── src/
│   ├── components/                  # Componentes de UI
│   │   ├── AdminLoginModal.jsx      # Modal de login admin
│   │   ├── CreateMessageModal.jsx   # Modal para escribir un mensaje
│   │   ├── EmptyState.jsx           # Pantalla cuando no hay mensajes
│   │   ├── FloatingButton.jsx       # Botón flotante "+"
│   │   ├── Header.jsx               # Logo + zona secreta de admin
│   │   ├── LoadingState.jsx         # Skeleton de carga
│   │   ├── MessageCard.jsx          # Tarjeta individual de mensaje
│   │   ├── MessageModal.jsx         # Vista ampliada de un mensaje
│   │   ├── MusicPlayer.jsx          # Reproductor flotante
│   │   └── ParticleBackground.jsx   # Fondo animado
│   │
│   ├── hooks/                       # Lógica reutilizable
│   │   ├── useAdmin.js              # Sesión admin + tap secreto
│   │   ├── useMessages.js           # CRUD + Realtime de mensajes
│   │   └── useMusicPlayer.js        # Control de la música ambiental
│   │
│   ├── lib/
│   │   └── supabase.js              # Cliente único de Supabase
│   │
│   ├── App.jsx                      # Componente raíz (orquesta todo)
│   ├── main.jsx                     # Entry point de React
│   └── index.css                    # Estilos globales + Tailwind
│
├── supabase/
│   └── schema.sql                   # Schema completo + RLS + Realtime
│
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore
├── index.html                       # HTML base
├── netlify.toml                     # Config para deploy automático
├── package.json
├── postcss.config.js
├── tailwind.config.js               # Tema personalizado
├── vite.config.js
└── README.md                        # (este archivo)
```

---


## 🧩 Arquitectura general

```
                                ┌─────────────────────────────┐
                                │   Supabase (PostgreSQL +    │
                                │   Realtime + Storage)       │
                                │                             │
                                │   Tabla: mensajes           │
                                └──────────┬──────────────────┘
                                           │
                                           │  REST + WebSocket
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                │                                                     │
                ▼                                                     ▼
        ┌───────────────┐                                      ┌───────────────┐
        │  Usuario A    │   ───── publica mensaje ─────►       │  Usuario B    │
        │  (móvil)      │                                      │  (laptop)     │
        │               │   ◄───── recibe en vivo ─────        │               │
        └───────────────┘                                      └───────────────┘
                ▲                                                     ▲
                │                                                     │
                │           Frontend (React + Vite + Tailwind)        │
                │           desplegado en Netlify CDN                 │
                └─────────────────────────────────────────────────────┘
```

**Componentes clave:**

| Capa | Tecnología | Función |
|------|-----------|---------|
| Frontend | React 18 + Vite | UI y lógica del cliente |
| Estilos | TailwindCSS 3 + CSS variables | Diseño cozy-cyberpunk |
| Animaciones | Framer Motion 11 | Transiciones, entradas, hover |
| Iconos | Lucide React | Iconografía limpia y consistente |
| Backend | Supabase | PostgreSQL + REST + Realtime (WebSocket) |
| Hosting | Netlify | CDN global + auto-deploy desde GitHub |

---


**Para los maestros que nos enseñaron a pensar:** gracias.
