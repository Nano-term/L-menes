import { useEffect, useState, useCallback } from 'react';
import { supabase, MESSAGES_TABLE } from '../lib/supabase';

/**
 * Hook principal: maneja todo lo relacionado con mensajes.
 *
 *  - Carga inicial desde Supabase (ordenados por fecha desc).
 *  - Suscripción Realtime para INSERT y DELETE.
 *  - Función para insertar un mensaje nuevo.
 *  - Función para eliminar (solo admin).
 *
 * Retorna: { messages, loading, error, addMessage, deleteMessage, refresh }
 */
export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----- Carga inicial -----
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('[useMessages] Error al cargar mensajes:', fetchError);
      setError(fetchError.message);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ----- Suscripción Realtime -----
  useEffect(() => {
    const channel = supabase
      .channel('mensajes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: MESSAGES_TABLE },
        (payload) => {
          // Insertar al inicio (más reciente arriba), evitar duplicados.
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: MESSAGES_TABLE },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ----- Insertar mensaje -----
  const addMessage = useCallback(async ({ nombre, para, mensaje }) => {
    const payload = {
      nombre: (nombre || '').trim() || 'Anónimo',
      para: (para || '').trim() || 'General',
      mensaje: (mensaje || '').trim(),
    };

    if (!payload.mensaje) {
      return { success: false, error: 'El mensaje no puede estar vacío.' };
    }

    const { data, error: insertError } = await supabase
      .from(MESSAGES_TABLE)
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      console.error('[useMessages] Error al insertar:', insertError);
      return { success: false, error: insertError.message };
    }

    // Optimistic update: si por alguna razón Realtime tarda, lo metemos ya.
    setMessages((prev) => {
      if (prev.some((m) => m.id === data.id)) return prev;
      return [data, ...prev];
    });

    return { success: true, data };
  }, []);

  // ----- Eliminar mensaje (admin) -----
  const deleteMessage = useCallback(async (id) => {
    const { error: deleteError } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[useMessages] Error al eliminar:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Update local inmediato (Realtime también lo hará pero esto es instantáneo).
    setMessages((prev) => prev.filter((m) => m.id !== id));
    return { success: true };
  }, []);

  return {
    messages,
    loading,
    error,
    addMessage,
    deleteMessage,
    refresh: fetchMessages,
  };
}
