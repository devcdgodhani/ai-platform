import { useState } from 'react';
import { ChatWindow } from '@/features/chat/components/ChatWindow';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useConversations } from '@/features/chat/hooks/useConversations';
import { useChatStore } from '@/features/chat/store/chat.store';
import { clsx } from 'clsx';
import { MessageSquare, Plus, Database, Bot, FileText, LogOut, MessageCircle } from 'lucide-react';

type ActiveView = 'chat' | 'rag' | 'agents' | 'documents';

const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: 'chat',      label: 'Chat',      icon: <MessageCircle size={16} /> },
  { id: 'rag',       label: 'RAG',       icon: <Database size={16} /> },
  { id: 'agents',    label: 'Agents',    icon: <Bot size={16} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
];

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const { activeConversationId, setActiveConversation: setActiveConversationId } = useChatStore();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);
  
  const { data: conversationsData, isLoading } = useConversations();
  const conversations = conversationsData?.items || [];

  return (
    <div className="h-full flex bg-gradient-to-br from-[rgb(15,15,23)] via-[rgb(22,22,35)] to-[rgb(15,15,40)]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col glass border-r border-white/5 shrink-0 shadow-xl z-10">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-sm">
              ✦
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Platform</p>
              <p className="text-xs text-brand-300/70">Enterprise Workspace</p>
            </div>
          </div>
        </div>

        {/* Modules Nav */}
        <nav className="p-3 space-y-1 border-b border-white/5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                activeView === item.id
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent',
              )}
            >
              <span className={clsx(activeView === item.id ? 'text-brand-400' : 'opacity-50')}>{item.icon}</span>
              {item.label}
              {item.id !== 'chat' && (
                <span className="ml-auto text-[10px] text-white/20 font-normal uppercase tracking-wider">Soon</span>
              )}
            </button>
          ))}
        </nav>

        {/* New Chat Button (Only show if in Chat view) */}
        {activeView === 'chat' && (
          <div className="p-4 pb-2">
            <button
              onClick={() => setActiveConversationId(null)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 active:scale-95 shadow-lg shadow-brand-500/20"
            >
              <Plus size={16} />
              New Conversation
            </button>
          </div>
        )}

        {/* History Nav */}
        {activeView === 'chat' && (
          <>
            <div className="px-4 py-2 mt-2 text-xs font-semibold text-white/30 uppercase tracking-wider">
              History
            </div>
            <nav className="flex-1 px-3 overflow-y-auto space-y-1 mb-4 custom-scrollbar">
              {isLoading ? (
                <div className="px-3 py-2 text-xs text-white/20 animate-pulse">Loading history...</div>
              ) : conversations.length === 0 ? (
                <div className="px-3 py-2 text-xs text-white/20">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left truncate',
                      activeConversationId === conv.id
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent',
                    )}
                  >
                    <MessageSquare size={14} className="shrink-0 opacity-50" />
                    <span className="truncate flex-1">{conv.title || 'New Chat'}</span>
                  </button>
                ))
              )}
            </nav>
          </>
        )}

        {/* User */}
        <div className="p-4 border-t border-white/5 bg-black/20 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate uppercase tracking-wider">{user?.role}</p>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {activeView === 'chat' && (
          <ChatWindow conversationId={activeConversationId} key={activeConversationId || 'new'} />
        )}
        
        {activeView !== 'chat' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mb-6 text-brand-400">
              {NAV_ITEMS.find((n) => n.id === activeView)?.icon}
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {NAV_ITEMS.find((n) => n.id === activeView)?.label}
            </h2>
            <p className="text-white/40 text-sm max-w-sm text-center">
              This module is currently under development. Check back soon for updates to the AI Platform.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
