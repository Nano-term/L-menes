-- ============================================================
-- LÚMENES · Muro emocional · Schema de base de datos
-- ============================================================
-- Ejecuta este script COMPLETO en el SQL Editor de Supabase.
-- (Dashboard → SQL Editor → New query → pega esto → Run)
-- ============================================================


-- ------------------------------------------------------------
-- 1. Tabla principal: mensajes
-- ------------------------------------------------------------
create table if not exists public.mensajes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null default 'Anónimo' check (char_length(nombre) <= 60),
  para        text not null default 'General' check (char_length(para)    <= 80),
  mensaje     text not null check (char_length(mensaje) between 1 and 2000),
  created_at  timestamptz not null default now()
);

-- Índice para ordenar rápido por fecha descendente
create index if not exists mensajes_created_at_idx
  on public.mensajes (created_at desc);


-- ------------------------------------------------------------
-- 2. Row Level Security (RLS)
-- ------------------------------------------------------------
-- Activamos RLS y definimos políticas explícitas.
alter table public.mensajes enable row level security;

-- Limpieza previa (idempotente)
drop policy if exists "lectura pública" on public.mensajes;
drop policy if exists "insertar anónimo" on public.mensajes;
drop policy if exists "borrar abierto"   on public.mensajes;

-- 2.1 Lectura pública: cualquiera puede ver los mensajes
create policy "lectura pública"
  on public.mensajes
  for select
  using (true);

-- 2.2 Inserción pública: cualquier visitante puede dejar un mensaje
create policy "insertar anónimo"
  on public.mensajes
  for insert
  with check (true);

-- 2.3 Borrar: políticamente abierto (la app valida con password en el cliente).
--     NOTA DE SEGURIDAD: para producción estricta conviene migrar a Supabase Auth
--     y restringir el delete a un rol "admin". Para un proyecto universitario es
--     suficiente con la puerta de contraseña en el cliente + esta política.
create policy "borrar abierto"
  on public.mensajes
  for delete
  using (true);


-- ------------------------------------------------------------
-- 3. Realtime
-- ------------------------------------------------------------
-- Añadimos la tabla a la publicación de Realtime para que el frontend
-- reciba eventos INSERT/DELETE en vivo.
-- Si la publicación ya existe (caso normal en Supabase), simplemente
-- agregamos la tabla. Si no, la creamos.
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;
end$$;

-- "alter publication ... add table" falla si la tabla ya está en la publicación,
-- por eso lo envolvemos en un bloque que ignora el error específico.
do $$
begin
  alter publication supabase_realtime add table public.mensajes;
exception
  when duplicate_object then
    -- La tabla ya estaba en la publicación, no pasa nada.
    null;
end$$;


-- ------------------------------------------------------------
-- 4. (Opcional) Datos semilla para probar
-- ------------------------------------------------------------
-- Descomenta estas líneas si quieres ver tarjetas de ejemplo al iniciar.
--
-- insert into public.mensajes (nombre, para, mensaje) values
--   ('Anónimo', 'Maestra López', 'Gracias por enseñarnos que el código también puede ser arte. Sus clases marcaron mi forma de pensar.'),
--   ('Diego R.', 'Maestro Hernández', 'Nunca olvidaré esa madrugada explicando recursividad con dibujos en la pizarra. Eternamente agradecido.'),
--   ('Anónimo', 'General', 'A todos los maestros: gracias por aguantar nuestras preguntas a las 11 pm.');


-- ============================================================
-- ¡Listo! Ya puedes correr la app y empezar a recibir mensajes.
-- ============================================================
