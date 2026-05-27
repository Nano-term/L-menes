import { createClient } from '@supabase/supabase-js';

/**
 * Cliente único de Supabase para toda la aplicación.
 *
 * Las variables se inyectan en build time desde el archivo .env (en local)
 * o desde las variables de entorno de Netlify (en producción).
 *
 * IMPORTANTE: usar el prefijo VITE_ para que Vite las exponga al frontend.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Advertencia clara en consola si faltan las variables.
  // No tiramos error para no romper la UI; el hook useMessages mostrará
  // un estado vacío con instrucciones.
  console.warn(
    '[Lúmenes] Faltan variables de entorno: VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
      'Revisa tu archivo .env o la configuración en Netlify.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/** Nombre de la tabla principal — centralizado para facilitar cambios. */
export const MESSAGES_TABLE = 'mensajes';
