# 📖 Documentación técnica — Lúmenes

Este documento complementa el `README.md` con detalles más profundos de la arquitectura, los protocolos, y los componentes. Está pensado para:

- Entregar como anexo en el proyecto universitario.
- Servir de referencia para futuras extensiones.
- Explicar el sistema a alguien que nunca lo ha visto.

---

## 1. Visión general del sistema

Lúmenes es una **aplicación web cliente-servidor en tiempo real** con arquitectura JAMstack + BaaS:

- **J**avaScript en el cliente (React).
- **A**PIs servidas por un BaaS (Supabase).
- **M**arkup pre-construido y servido desde un CDN (Netlify).

No hay un servidor propio que mantener: Supabase actúa como el "backend completo" (base de datos, REST API, capa de tiempo real, autenticación opcional), y Netlify sirve los archivos estáticos del frontend.

### Diagrama de bloques

```
┌────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR DEL USUARIO                    │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐    │
│   │                  React 18 + Vite                     │    │
│   │                                                      │    │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│   │   │ App.jsx  │──│  Hooks   │──│   Componentes    │  │    │
│   │   │  (raíz)  │  │ useMess. │  │ MessageCard etc. │  │    │
│   │   └──────────┘  │ useMusic │  └──────────────────┘  │    │
│   │                 │ useAdmin │                         │    │
│   │                 └─────┬────┘                         │    │
│   │                       │                              │    │
│   │              ┌────────▼────────┐                     │    │
│   │              │ supabase-js SDK │                     │    │
│   │              └────────┬────────┘                     │    │
│   └───────────────────────┼──────────────────────────────┘    │
└───────────────────────────┼───────────────────────────────────┘
                            │
                  HTTPS  ┌──┴──┐  WebSocket
                         │     │
                ┌────────▼─────▼────────┐
                │       SUPABASE        │
                │                       │
                │  ┌─────────────────┐  │
                │  │   PostgREST     │◄─┼── INSERT/SELECT/DELETE
                │  └────────┬────────┘  │
                │           │           │
                │  ┌────────▼────────┐  │
                │  │   PostgreSQL    │  │
                │  │                 │  │
                │  │  Tabla:         │  │
                │  │  public.mensajes│  │
                │  └────────┬────────┘  │
                │           │           │
                │  ┌────────▼────────┐  │
                │  │ Logical Replic. │  │
                │  └────────┬────────┘  │
                │           │           │
                │  ┌────────▼────────┐  │
                │  │ Realtime Server │◄─┼── WebSocket suscripción
                │  └─────────────────┘  │
                └───────────────────────┘
                            ▲
                            │ archivos estáticos
                ┌───────────┴───────────┐
                │   Netlify (CDN)       │
                │   dist/ servidos      │
                │   global edge nodes   │
                └───────────────────────┘
```

---

## 2. Flujo completo: publicar un mensaje

Paso a paso, qué pasa entre el momento en que el usuario presiona "Publicar" y el momento en que aparece la tarjeta en el muro de otra persona:

### 2.1. En el cliente que publica

```
1. Usuario completa el formulario y presiona "Publicar en el muro".
2. CreateMessageModal.handleSubmit(e):
     - Valida que mensaje no esté vacío.
     - Llama a addMessage({ nombre, para, mensaje }).
3. addMessage (en useMessages.js):
     - Sanitiza inputs: trim, fallback a "Anónimo" / "General".
     - Llama a: supabase.from('mensajes').insert(payload).select().single()
4. supabase-js SDK:
     - Construye request HTTP POST a:
         https://<proyecto>.supabase.co/rest/v1/mensajes
     - Headers incluyen: apikey, Authorization (Bearer anon-key), Content-Type.
     - Body: { "nombre": "...", "para": "...", "mensaje": "..." }
```

### 2.2. En Supabase

```
5. PostgREST recibe el POST.
6. PostgreSQL valida políticas RLS:
     - "insertar anónimo" (FOR INSERT WITH CHECK (true)) → permitido.
7. INSERT se ejecuta. Se asigna id (uuid) y created_at (timestamptz) por defecto.
8. PostgreSQL responde con la fila creada.
9. PostgREST devuelve 201 Created + el JSON de la fila al cliente.
10. Simultáneamente, el evento INSERT viaja al replicador lógico de PG.
11. El Realtime server recibe el evento y lo emite por WebSocket a TODOS
    los clientes suscritos al canal "mensajes-realtime".
```

### 2.3. En el cliente que recibe

```
12. El listener .on('postgres_changes', { event: 'INSERT', ... }) se dispara.
13. El payload llega con la forma:
        { eventType: 'INSERT', new: { id, nombre, para, mensaje, created_at }, ... }
14. setMessages((prev) => [payload.new, ...prev])
15. React re-renderiza el grid.
16. Framer Motion anima la entrada con un fade-up de 0.55s.
```

### 2.4. En el cliente que publicó

```
12'. El SDK devuelve la fila insertada (paso 9).
13'. addMessage hace optimistic update: setMessages([data, ...prev]).
14'. CUIDADO: cuando llegue el evento de Realtime al mismo cliente,
     el hook detecta que el id ya existe en prev y NO lo duplica.
15'. CreateMessageModal limpia los inputs y se cierra con animación.
```

> El "optimistic update" + la deduplicación por id hacen que la experiencia se sienta instantánea **incluso si la red está lenta**, sin causar duplicados.

---

## 3. Realtime: cómo funciona por debajo

Supabase Realtime es un servidor en Elixir (Phoenix) que escucha el **WAL (Write-Ahead Log)** de PostgreSQL via _logical replication_. Cuando una tabla está en la publicación `supabase_realtime`, cualquier INSERT/UPDATE/DELETE genera un mensaje que se rebroadcastea por WebSocket a los clientes suscritos al canal correspondiente.

### Protocolo simplificado

```
Cliente                                  Realtime Server
   │                                            │
   │  ── WS handshake ─────────────────────────►│
   │                                            │
   │  ── { topic: "realtime:public:mensajes",   │
   │       event: "phx_join" } ────────────────►│
   │                                            │
   │  ◄── { event: "phx_reply", payload: OK }   │
   │                                            │
   │                                            │
   │       (alguien hace INSERT)                │
   │                                            │
   │  ◄── { event: "postgres_changes",          │
   │        payload: { eventType: "INSERT",     │
   │                   new: {...} } }           │
   │                                            │
   │   ... mantiene la conexión abierta ...     │
   │                                            │
   │  ── heartbeat cada 30s ───────────────────►│
   │                                            │
```

El SDK `@supabase/supabase-js` abstrae todo esto. Lo que escribes:

```javascript
supabase
  .channel('mensajes-realtime')
  .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'mensajes' },
      (payload) => { ... })
  .subscribe();
```

...se traduce internamente en un join al topic `realtime:public:mensajes` con filtros.

---

## 4. Estructura de la base de datos

### Tabla `mensajes`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Identificador único |
| `nombre` | `text` | NOT NULL, default `'Anónimo'`, ≤ 60 chars | Firma del autor |
| `para` | `text` | NOT NULL, default `'General'`, ≤ 80 chars | Destinatario |
| `mensaje` | `text` | NOT NULL, 1–2000 chars | Contenido del mensaje |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Fecha de publicación |

### Índices

- `mensajes_created_at_idx` sobre `created_at DESC` — acelera el listado.

### Políticas RLS

| Política | Operación | Condición |
|----------|-----------|-----------|
| `lectura pública` | SELECT | `USING (true)` |
| `insertar anónimo` | INSERT | `WITH CHECK (true)` |
| `borrar abierto` | DELETE | `USING (true)` |

> No hay políticas de UPDATE, por lo que **nadie puede editar mensajes existentes**. Esto es intencional: preserva la autenticidad de lo que se publicó.

### Ejemplo de fila (JSON)

```json
{
  "id": "9e3a8c2a-4f1b-4d11-94c6-5b2b3a0e8f6e",
  "nombre": "Carla R.",
  "para": "Maestro Ramírez",
  "mensaje": "Gracias por enseñarnos que el código también puede ser bonito.",
  "created_at": "2026-05-27T19:42:11.118Z"
}
```

---

## 5. Inventario de componentes

### `App.jsx` (raíz)
Orquesta tres hooks (`useMessages`, `useMusicPlayer`, `useAdmin`) y monta todos los componentes visuales. Maneja dos piezas de estado local: `openMessage` (modal de vista ampliada) y `createOpen` (modal de creación).

### `ParticleBackground.jsx`
Fondo decorativo en `position: fixed`, `z-index: -10`. Compuesto por:
- Base sólida color `midnight-50`.
- Malla de gradientes radiales animada.
- 5 orbes con `blur(40px)` flotando en bucle (Framer Motion).
- Capa de grano SVG con `mix-blend-overlay`.
- Viñeta superior e inferior.

### `Header.jsx`
- Logo `lúmenes.` donde el `.` es un botón con el handler `onSecretTap`.
- Subtítulo poético.
- Badge con el contador de mensajes.
- Badge de "modo admin" si está activo, con botón de logout.

### `MessageCard.jsx`
Tarjeta individual. Diseño:
- Glassmorphism (`.glass`).
- Tinte de color único por id (función `hashToHue`).
- Línea de luz superior con gradiente.
- Datos: `para` destacado, `mensaje` con `line-clamp-6`, `nombre` y fecha relativa.
- Botón de eliminar (solo admin) con `opacity-0 group-hover:opacity-100`.
- Animación de entrada escalonada por `index`.

### `MessageModal.jsx`
Vista ampliada de un mensaje. Diseño tipo "carta abierta":
- Overlay con `backdrop-blur(14px)`.
- Card centrada con `max-w-2xl`.
- Cuerpo del mensaje en `font-serif italic`.
- Botón de eliminar (admin) en sección separada.
- Cierra con click fuera, botón X, o tecla ESC.

### `CreateMessageModal.jsx`
Formulario controlado. Inputs:
- `nombre`: text, max 60 chars, opcional.
- `para`: text, max 80 chars, opcional.
- `mensaje`: textarea, 1–2000 chars, obligatorio.

Maneja:
- Submit asíncrono con loading state.
- Error inline si la inserción falla.
- Limpieza de campos al cerrar exitosamente.

### `AdminLoginModal.jsx`
Modal compacto pidiendo contraseña.
- Animación de "shake" si la contraseña es incorrecta.
- Foco automático en el input.
- Cierra con ESC o click fuera.

### `FloatingButton.jsx`
Botón "+" pegado a la esquina inferior derecha. Glow pulsante con `motion.div` animado.

### `MusicPlayer.jsx`
Reproductor flotante en esquina inferior izquierda. Dos estados:
- **Antes de activar:** pill simple con "Activar ambiente".
- **Después de activar:** pill colapsada con el título de la canción → expandible a panel con controles (play/pause, skip, slider de volumen).

### `EmptyState.jsx`
Pantalla mostrada cuando no hay mensajes. Invita a publicar el primero.

### `LoadingState.jsx`
6 skeleton cards con animación de pulso mientras se carga.

---

## 6. Dependencias y por qué cada una

| Paquete | Versión | Para qué |
|---------|---------|----------|
| `react` | 18.3 | Librería UI |
| `react-dom` | 18.3 | Renderer del DOM |
| `vite` | 5.4 | Build tool + dev server con HMR |
| `@vitejs/plugin-react` | 4.3 | Soporte JSX para Vite |
| `tailwindcss` | 3.4 | Utility-first CSS |
| `autoprefixer` | 10.4 | Vendor prefixes automáticos |
| `postcss` | 8.4 | Procesa el CSS de Tailwind |
| `@supabase/supabase-js` | 2.45 | SDK oficial: REST + Realtime + Auth |
| `framer-motion` | 11.5 | Animaciones declarativas en React |
| `lucide-react` | 0.441 | Iconos (Plus, Music, ShieldCheck, etc.) |

Cualquiera puede reemplazarse, pero estas cubren el caso elegantemente con poca configuración.

---

## 7. Variables de entorno (referencia)

```ini
# Públicas (con prefijo VITE_, expuestas al cliente)
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJ...
VITE_ADMIN_PASSWORD=holacomoestas69
```

⚠️ Importante:
- Solo las variables con prefijo `VITE_` quedan disponibles en el navegador.
- La `anon key` es pública por diseño; está limitada por las políticas RLS.
- La **service_role key** (que también te da Supabase) NUNCA debe ir en el frontend.
- En Netlify se configuran en: **Site settings → Environment variables**.
- Después de cambiarlas en Netlify, requiere un nuevo deploy para que tomen efecto.

---

## 8. Pipeline de deploy

```
git push (main)
   │
   ▼
GitHub recibe el commit
   │
   ▼
Webhook a Netlify
   │
   ▼
Netlify ejecuta:
   1. npm ci  (instala dependencias)
   2. npm run build  (Vite produce dist/)
   3. Sube dist/ al CDN edge global
   │
   ▼
URL https://lumenes.netlify.app actualizada en ~1 minuto
```

Variables de entorno se inyectan en el paso 2.

---

## 9. Seguridad — qué cubre y qué no

### ✅ Cubierto

- **Sin SQL injection:** todo pasa por PostgREST con parámetros sanitizados.
- **CORS:** Supabase lo maneja.
- **Sin XSS:** React escapa por defecto todo lo que entra en `{ }`. No usamos `dangerouslySetInnerHTML`.
- **Sin sobrecarga de inserciones:** límites de longitud a nivel BD (CHECK constraints).
- **Tráfico encriptado:** HTTPS por default en Netlify + Supabase.
- **Anon key limitada:** aunque sea pública, solo puede hacer lo que las políticas RLS permiten.

### ⚠️ No cubierto (lo asumimos como aceptable en este alcance)

- **Spam / mensajes ofensivos:** no hay rate limiting ni moderación automática. El modo admin manual lo mitiga.
- **Validación de contraseña client-side:** un atacante con conocimientos de DevTools podría leer la contraseña del bundle de JS. Para un proyecto universitario es aceptable; en producción seria, migrar a Supabase Auth.
- **No hay captcha:** podría hacerse con hCaptcha + un Edge Function de Supabase si fuera necesario.

---

## 10. Apéndice: ejemplos SQL útiles

### Ver los últimos 20 mensajes desde el editor SQL
```sql
select id, nombre, para, left(mensaje, 60) as preview, created_at
from public.mensajes
order by created_at desc
limit 20;
```

### Contar mensajes por destinatario
```sql
select para, count(*) as total
from public.mensajes
group by para
order by total desc;
```

### Borrar todos los mensajes (¡cuidado!)
```sql
delete from public.mensajes;
```

### Limitar tamaño máximo de un mensaje a 5000 caracteres
```sql
alter table public.mensajes
  drop constraint mensajes_mensaje_check,
  add constraint mensajes_mensaje_check
    check (char_length(mensaje) between 1 and 5000);
```

---

## 11. Checklist final para presentar

- [ ] El proyecto compila sin errores (`npm run build`).
- [ ] Las variables de entorno están en `.env` (local) y en Netlify (producción).
- [ ] El schema SQL está corrido en Supabase.
- [ ] Las políticas RLS están activas (3 políticas en `mensajes`).
- [ ] Realtime está habilitado para la tabla.
- [ ] Hay al menos 3-4 mensajes de prueba (puedes usar los del SQL semilla).
- [ ] La música ambiental tiene al menos 2 canciones.
- [ ] Se probó el flujo completo en dos dispositivos a la vez (publicar en uno, verlo aparecer en el otro).
- [ ] Se probó el modo admin (tap secreto + contraseña + eliminar mensaje).
- [ ] El deploy en Netlify está vivo y la URL funciona.
- [ ] El repositorio en GitHub tiene un README claro.

---

Hecho. Cualquier duda revisar el README principal o los comentarios inline en cada archivo.
