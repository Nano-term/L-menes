import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useMessages } from './hooks/useMessages';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { useAdmin } from './hooks/useAdmin';

import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import MessageCard from './components/MessageCard';
import MessageModal from './components/MessageModal';
import CreateMessageModal from './components/CreateMessageModal';
import AdminLoginModal from './components/AdminLoginModal';
import FloatingButton from './components/FloatingButton';
import MusicPlayer from './components/MusicPlayer';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';

export default function App() {
  // ===== Hooks principales =====
  const { messages, loading, error, addMessage, deleteMessage } = useMessages();
  const music = useMusicPlayer();
  const admin = useAdmin();

  // ===== UI state =====
  const [openMessage, setOpenMessage] = useState(null); // mensaje en vista ampliada
  const [createOpen, setCreateOpen] = useState(false); // modal de creación

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-glow/30">
      <ParticleBackground />

      <Header
        onSecretTap={admin.registerTap}
        isAdmin={admin.isAdmin}
        onLogout={admin.logout}
        totalMessages={messages.length}
      />

      <main className="relative px-4 md:px-8 pb-32 pt-4 max-w-6xl mx-auto">
        {/* Estado de carga */}
        {loading && <LoadingState />}

        {/* Error de conexión */}
        {!loading && error && (
          <div className="max-w-md mx-auto mt-12 p-6 rounded-3xl glass border border-rose-400/30 text-center">
            <p className="font-serif text-xl text-rose-200 mb-2">
              No se pudo conectar al muro
            </p>
            <p className="text-sm text-slate-400 font-mono break-words">{error}</p>
            <p className="text-xs text-slate-500 mt-4">
              Revisa las variables <code>VITE_SUPABASE_URL</code> y{' '}
              <code>VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !error && messages.length === 0 && (
          <EmptyState onCreate={() => setCreateOpen(true)} />
        )}

        {/* Grid de tarjetas — masonry-like usando CSS columns */}
        {!loading && !error && messages.length > 0 && (
          <div
            className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]"
            style={{ columnGap: '1.25rem' }}
          >
            <AnimatePresence>
              {messages.map((message, i) => (
                <div key={message.id} className="mb-5 break-inside-avoid">
                  <MessageCard
                    message={message}
                    onClick={setOpenMessage}
                    isAdmin={admin.isAdmin}
                    onDelete={deleteMessage}
                    index={i}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Botón flotante de crear mensaje */}
      <FloatingButton onClick={() => setCreateOpen(true)} />

      {/* Reproductor de música */}
      <MusicPlayer {...music} />

      {/* Modales */}
      <MessageModal
        message={openMessage}
        onClose={() => setOpenMessage(null)}
        isAdmin={admin.isAdmin}
        onDelete={deleteMessage}
      />

      <CreateMessageModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={addMessage}
      />

      <AdminLoginModal
        open={admin.showLogin}
        onClose={admin.closeLogin}
        onSubmit={admin.attemptLogin}
      />

      {/* Footer minimalista */}
      <footer className="relative py-10 text-center text-[11px] font-mono text-slate-600">
        <p>
          construido con cariño · ingeniería en software · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
