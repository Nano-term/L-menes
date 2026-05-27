# 🌙 Lúmenes

> Un muro digital emocional para los maestros de Ingeniería en Software.

Lúmenes es una aplicación full-stack en tiempo real donde los alumnos pueden dejar pensamientos, agradecimientos, recuerdos y mensajes para sus docentes. Diseñada con una estética cozy-cyberpunk: vidrio, gradientes oscuros, partículas y música ambiental.

![Stack](https://img.shields.io/badge/React-18-7ee8fa) ![Vite](https://img.shields.io/badge/Vite-5-a78bfa) ![Tailwind](https://img.shields.io/badge/Tailwind-3-88d3ce) ![Supabase](https://img.shields.io/badge/Supabase-realtime-6d5acd) ![Netlify](https://img.shields.io/badge/Netlify-deploy-ffc1d6)

---

## 🚀 Instalación rápida (5 minutos)

```bash
# 1. Clona o descarga el proyecto
git clone <tu-repo> muro-emocional
cd muro-emocional

# 2. Instala dependencias
npm install

# 3. Copia el archivo de variables de entorno
cp .env.example .env
# (en Windows PowerShell: Copy-Item .env.example .env)

# 4. Edita .env con tus credenciales de Supabase (ver más abajo)

# 5. Corre el servidor de desarrollo
npm run dev
```

Abre `http://localhost:5173` y listo.

> **Antes de correrlo necesitas configurar Supabase.** Lee la sección [Configurar Supabase](#-configurar-supabase) abajo.

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

## 🗄️ Configurar Supabase

### Paso 1 — Crear proyecto

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (gratis).
2. Click en **New Project**.
3. Asigna:
   - **Name:** `lumenes` (o lo que quieras)
   - **Database Password:** una contraseña fuerte (guárdala)
   - **Region:** la más cercana (ej. `East US` o `South America`)
4. Espera ~1 minuto a que se cree.

### Paso 2 — Correr el SQL

1. En el dashboard de tu proyecto, ve a **SQL Editor** (icono `< >` en la barra izquierda).
2. Click en **New query**.
3. Abre el archivo `supabase/schema.sql` de este proyecto, copia **todo el contenido** y pégalo.
4. Click en **Run**.

Esto crea:
- La tabla `mensajes`.
- Las políticas de seguridad (RLS).
- La suscripción a Realtime.

### Paso 3 — Copiar las credenciales

1. Ve a **Project Settings** (engranaje) → **API**.
2. Copia:
   - **Project URL** → la pegas en `VITE_SUPABASE_URL`
   - **anon public key** → la pegas en `VITE_SUPABASE_ANON_KEY`

> ⚠️ La `anon key` es **pública** y está diseñada para usarse en el frontend. La que NUNCA debes exponer es la `service_role key`.

### Paso 4 — Verificar Realtime

1. Ve a **Database** → **Replication**.
2. Asegúrate de que la tabla `mensajes` aparece con Realtime habilitado.
3. Si no, busca el toggle y actívalo.

---

## ⚙️ Variables de entorno

Crea un archivo `.env` (basado en `.env.example`):

```ini
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
VITE_ADMIN_PASSWORD=holacomoestas69
```

| Variable | ¿Qué es? | ¿Obligatoria? |
|----------|----------|---------------|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | ✅ Sí |
| `VITE_SUPABASE_ANON_KEY` | API key pública del proyecto | ✅ Sí |
| `VITE_ADMIN_PASSWORD` | Contraseña del modo administrador | ⚪ Opcional (cae al default del código) |

> Solo las variables con prefijo `VITE_` quedan expuestas al navegador. Vite es estricto con eso por seguridad.

---

## 🎵 Agregar música ambiental

1. Pon tus archivos `.mp3` en `public/music/`.
2. Edita `public/music/playlist.json` con esta forma:

```json
[
  { "title": "noche lenta",       "src": "/music/01-noche-lenta.mp3" },
  { "title": "estudio nocturno",  "src": "/music/02-estudio-nocturno.mp3" }
]
```

Si no agregas canciones, el reproductor simplemente no aparece. La app sigue funcionando.

**¿Dónde conseguir música libre?**
- [Pixabay Music](https://pixabay.com/music/) — gratis, sin atribución
- [Free Music Archive](https://freemusicarchive.org/)
- [YouTube Audio Library](https://studio.youtube.com)
- [Chosic](https://www.chosic.com/free-music/)

Géneros que combinan bien con la estética: lo-fi hip hop, ambient, downtempo, post-rock instrumental, synthwave suave.

---

## 🔐 Modo administrador (oculto)

Hay un easter egg para entrar al modo admin:

1. En la pantalla principal, busca el **punto luminoso** al final del título `lúmenes.` (el "." es un círculo cyan brillante).
2. **Tócalo 3 veces seguidas** (en menos de 1.5 segundos).
3. Aparecerá un modal pidiendo contraseña.
4. Ingresa la contraseña (por defecto `holacomoestas69`, o la que pusiste en `VITE_ADMIN_PASSWORD`).
5. En modo admin, las tarjetas muestran un **icono de basura** al hacer hover y la vista ampliada tiene un botón "Eliminar mensaje".

La sesión admin dura mientras la pestaña esté abierta (se guarda en `sessionStorage`, NO en `localStorage`). Al cerrar la pestaña, se pierde.

> **Nota de seguridad:** la validación de la contraseña es del lado del cliente. Es suficiente para un proyecto universitario, pero no es seguridad robusta. Para producción se recomienda usar Supabase Auth (sección [Cómo agregar nuevas funciones](#-cómo-agregar-nuevas-funciones)).

---

## 🌐 Deploy a Netlify (paso a paso)

### Opción A — Desde GitHub (recomendada)

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "primer commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/muro-emocional.git
   git push -u origin main
   ```

2. **Conecta Netlify:**
   - Entra a [app.netlify.com](https://app.netlify.com).
   - Click en **Add new site** → **Import an existing project**.
   - Elige **GitHub** y autoriza.
   - Selecciona el repo `muro-emocional`.

3. **Configuración de build** (Netlify la detecta automática gracias a `netlify.toml`, pero verifica):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Variables de entorno:**
   - En **Site settings → Environment variables**, agrega:
     - `VITE_SUPABASE_URL` con tu URL
     - `VITE_SUPABASE_ANON_KEY` con tu key
     - `VITE_ADMIN_PASSWORD` con tu password (opcional)

5. **Deploy:** click en **Deploy site**. En ~1 minuto tendrás una URL `https://algo.netlify.app`.

Cada vez que hagas `git push`, Netlify redespliega automáticamente. ⚡

### Opción B — Deploy manual (drag & drop)

```bash
npm run build
```

Luego arrastra la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop). Listo. (Pero pierdes el auto-deploy.)

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

## 🔄 Flujo completo de datos

### Cuando alguien publica un mensaje

```
1. Usuario llena el modal de creación.
2. Click en "Publicar en el muro".
3. CreateMessageModal llama a `addMessage()` del hook useMessages.
4. useMessages hace: supabase.from('mensajes').insert({nombre, para, mensaje}).
5. Supabase valida con las políticas RLS:
       - lectura pública ✓
       - insertar anónimo ✓
   y guarda la fila en PostgreSQL.
6. PostgreSQL emite un evento de cambio (logical replication).
7. Supabase Realtime lo recibe y lo broadcastea por WebSocket a todos los
   clientes suscritos al canal "mensajes-realtime".
8. En cada navegador conectado:
       - El hook useMessages recibe el evento INSERT.
       - Agrega el nuevo mensaje al estado React.
       - El grid se re-renderiza con animación (Framer Motion).
9. El cliente que publicó YA tenía el mensaje gracias al "optimistic update".
```

### Cuando alguien elimina un mensaje (modo admin)

```
1. Admin abre la vista ampliada o pasa el cursor por una tarjeta.
2. Click en el botón de basura → confirm() de seguridad.
3. useMessages.deleteMessage(id) → supabase.from('mensajes').delete().eq('id', id).
4. PostgreSQL ejecuta el DELETE (política "borrar abierto").
5. Realtime broadcastea evento DELETE.
6. Todos los clientes filtran ese id de su estado y la tarjeta desaparece
   con animación de exit.
```

### Ejemplo de payload Realtime (JSON)

Lo que llega al cliente cuando alguien inserta:

```json
{
  "schema": "public",
  "table": "mensajes",
  "commit_timestamp": "2026-05-27T19:42:11.123Z",
  "eventType": "INSERT",
  "new": {
    "id": "9e3a8c2a-4f1b-4d11-94c6-5b2b3a0e8f6e",
    "nombre": "Carla R.",
    "para": "Maestro Ramírez",
    "mensaje": "Gracias por enseñarnos que el código también puede ser bonito.",
    "created_at": "2026-05-27T19:42:11.118Z"
  },
  "old": {}
}
```

---

## 🧠 Explicación de cada hook

### `useMessages.js`
El cerebro de la persistencia.
- **Al montar:** hace un `SELECT * FROM mensajes ORDER BY created_at DESC`.
- **Se suscribe** a un canal Realtime con dos listeners (`INSERT`, `DELETE`).
- Expone: `messages`, `loading`, `error`, `addMessage()`, `deleteMessage()`, `refresh()`.
- **Importante:** maneja "optimistic updates" para que la UI se sienta instantánea.

### `useMusicPlayer.js`
Reproductor de música ambiental.
- Carga `playlist.json` con `fetch`.
- Mantiene una "cola" mezclada (Fisher-Yates shuffle) que se renueva al agotarse.
- Crea un único elemento `<audio>` invisible y lo controla por refs.
- Expone: `activate`, `toggle`, `next`, `setVolume`, `currentTrack`, `isPlaying`, `volume`.
- Respeta las políticas de autoplay: nunca reproduce sin gesto del usuario.

### `useAdmin.js`
Modo administrador.
- Detecta la secuencia secreta (3 toques < 1.5s).
- Valida la contraseña contra `VITE_ADMIN_PASSWORD` (o un valor por defecto).
- Persiste la sesión en `sessionStorage` (no `localStorage`, así expira al cerrar la pestaña).
- Expone: `isAdmin`, `showLogin`, `registerTap`, `attemptLogin`, `closeLogin`, `logout`.

---

## 🎨 Sistema de diseño

### Paleta de colores

```css
--midnight-50:  #0a0b1e   /* fondo base, casi negro */
--midnight-300: #161b3a   /* tarjetas en estado base */
--plum-500:     #8b6fe8   /* acento violeta */
--cyan-glow:    #7ee8fa   /* acento principal */
--cyan-soft:    #88d3ce   /* acento secundario */
--rose-glow:    #ffc1d6   /* acento cálido (textos importantes) */
```

### Tipografías (de Google Fonts)

- **Instrument Serif** — display, títulos, texto poético.
- **Outfit** — body, UI elements.
- **JetBrains Mono** — metadatos, fechas, "etiquetas" tipo terminal.

### Efectos clave

- **Glassmorphism:** `backdrop-filter: blur(20px) saturate(160%)` sobre fondos translúcidos.
- **Glow:** sombras con color (`box-shadow: 0 0 24px rgba(126, 232, 250, 0.4)`).
- **Mesh gradient animado:** múltiples `radial-gradient` que se desplazan con `background-position`.
- **Orbes flotantes:** `<motion.div>` con animaciones Y/X infinitas y `blur(40px)`.
- **Grano de película:** SVG noise filter como overlay con `mix-blend-overlay`.

---

## 🛠️ Cómo agregar nuevas funciones

### Agregar un campo a los mensajes (ej. "categoría")

1. En `supabase/schema.sql`, agrega la columna:
   ```sql
   alter table public.mensajes add column categoria text default 'general';
   ```
2. Ejecuta ese ALTER en el SQL Editor de Supabase.
3. En `useMessages.js`, actualiza `addMessage` para aceptar `categoria`.
4. En `CreateMessageModal.jsx`, agrega un `<select>` o input.
5. En `MessageCard.jsx`, muestra el campo donde quieras.

### Agregar autenticación real (Supabase Auth)

1. Habilita el provider que quieras (email, Google, etc.) en Supabase → Authentication.
2. Reemplaza el modal de contraseña por `supabase.auth.signInWithPassword(...)`.
3. Cambia la política RLS de DELETE a:
   ```sql
   create policy "borrar solo admin" on public.mensajes
     for delete using (auth.jwt() ->> 'role' = 'admin');
   ```
4. Asigna el rol "admin" al usuario maestro en `auth.users`.

### Agregar reacciones (corazones a un mensaje)

1. Crea tabla `reacciones` con FK a `mensajes.id`.
2. Nuevo hook `useReactions(messageId)`.
3. Botón en `MessageCard` que hace insert/delete.
4. Suscríbete a Realtime para que se actualicen en vivo.

### Agregar moderación automática

1. Edge Function en Supabase que recibe el INSERT y revisa palabras prohibidas.
2. Si detecta algo, marca `mensaje.oculto = true`.
3. Agrega esa columna y filtra en el SELECT del frontend.

---

## 🐛 Errores comunes y soluciones

### "Failed to fetch" / "Network error"
- Revisa que `VITE_SUPABASE_URL` no tenga `/` al final.
- Verifica en Supabase Dashboard que el proyecto esté activo (no pausado por inactividad).

### Los mensajes no llegan en tiempo real
- En Supabase → **Database → Replication**, verifica que `mensajes` esté en la publicación `supabase_realtime`.
- Re-ejecuta la sección 3 de `schema.sql`.

### "Permission denied for table mensajes"
- Las políticas RLS no están bien. Vuelve a correr `schema.sql` completo.
- O ve a **Authentication → Policies** y revisa que existan las 3 políticas.

### Pantalla en blanco después de `npm run dev`
- Revisa la consola del navegador (F12).
- Casi siempre es que falta el `.env` o tiene errores de sintaxis.

### El reproductor de música no aparece
- Verifica que existe `public/music/playlist.json` y tiene al menos una entrada.
- Verifica que los `.mp3` realmente están en `public/music/`.
- Abre la consola del navegador para ver si hay errores 404.

### El botón "Activar ambiente" no hace nada
- Los navegadores requieren un gesto explícito antes de reproducir audio. Es normal que pidas click una vez.
- Si después de click no suena: verifica volumen del navegador y del sistema.

### El tap secreto no abre el modal de admin
- Tienes que tocar **el punto cyan** (no el texto "lúmenes").
- Debe ser 3 toques **en menos de 1.5 segundos**.
- Si pasa más tiempo entre toques, el contador se reinicia.

### Error de build en Netlify
- Revisa que las variables de entorno estén configuradas en Netlify (Site settings → Environment variables).
- Asegúrate de que `NODE_VERSION = 20` esté en `netlify.toml` (ya lo está).

---

## 📚 Glosario para principiantes

| Término | Qué significa |
|---------|---------------|
| **SPA** | Single Page Application. La app es UNA sola página HTML; la "navegación" la maneja JavaScript. |
| **RLS** | Row Level Security. Reglas que decide PostgreSQL para cada fila: ¿quién puede leer, insertar, borrar? |
| **Realtime** | Mecanismo de Supabase para que cuando algo cambia en la BD, todos los clientes se enteren al instante (vía WebSocket). |
| **WebSocket** | Conexión bidireccional persistente entre cliente y servidor. A diferencia de HTTP, queda "abierta". |
| **Hook (React)** | Función que empieza con `use*` y permite usar estado/efectos en componentes funcionales. |
| **Optimistic update** | Actualizar la UI antes de confirmar con el servidor, para que se sienta instantáneo. |
| **CDN** | Content Delivery Network. Netlify sirve tu sitio desde servidores cercanos al usuario. |
| **`.env`** | Archivo con secretos/configuración que NO se sube a Git. |
| **Anon key** | Llave pública de Supabase. Sirve para el frontend; está limitada por las políticas RLS. |

---

## 🎯 Comandos útiles

```bash
npm run dev       # servidor local con hot reload
npm run build     # build de producción → carpeta dist/
npm run preview   # previsualizar el build localmente
```

---

## 📜 Licencia

MIT — úsalo, modifícalo, compártelo. Hecho para un curso de Ingeniería en Software.

---

## 💌 Créditos

Diseñado y construido como proyecto final. Música no incluida — agrégala tú según tu gusto.

**Para los maestros que nos enseñaron a pensar:** gracias.
