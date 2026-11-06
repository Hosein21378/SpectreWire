import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  Language, 
  TunnelStats, 
  TunnelNode, 
  ProtocolConfig, 
  ClientToken, 
  WirePacket,
  AuthStatus 
} from './types/tunnel';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { TrafficTesterView } from './components/TrafficTesterView';
import { ProtocolConfigView } from './components/ProtocolConfigView';
import { WireInspectorView } from './components/WireInspectorView';
import { NodesView } from './components/NodesView';
import { ClientsView } from './components/ClientsView';
import { InstallView } from './components/InstallView';
import { SecurityModal } from './components/SecurityModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [lang, setLang] = useState<Language>('fa');
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);

  const [stats, setStats] = useState<TunnelStats | null>(null);
  const [nodes, setNodes] = useState<TunnelNode[]>([]);
  const [config, setConfig] = useState<ProtocolConfig | null>(null);
  const [tokens, setTokens] = useState<ClientToken[]>([]);
  const [packets, setPackets] = useState<WirePacket[]>([]);

  // Toggle Language & HTML dir
  const handleToggleLang = () => {
    const nextLang = lang === 'fa' ? 'en' : 'fa';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  // Auth Status Check
  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem('swp_auth_token') || '';
      const res = await fetch('/api/auth/status', {
        headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        if (!data.passwordProtected) {
          setIsAuthenticated(true);
        } else if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          // If token was not set, store initial token or ask for login
          if (data.initialSessionToken && !savedToken) {
            localStorage.setItem('swp_auth_token', data.initialSessionToken);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      }
    } catch {
      setIsAuthenticated(true);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
    fetchStats();
  };

  const handleLogout = async () => {
    try {
      const savedToken = localStorage.getItem('swp_auth_token') || '';
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
      });
    } catch {
      // ignore
    }
    localStorage.removeItem('swp_auth_token');
    setIsAuthenticated(false);
  };

  // Initial Fetch & Periodic Telemetry
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/tunnel/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch {
      // ignore transient poll error
    }
  };

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/tunnel/nodes');
      const data = await res.json();
      if (data.success) {
        setNodes(data.data);
      }
    } catch {
      // ignore
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/tunnel/config');
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch {
      // ignore
    }
  };

  const fetchTokens = async () => {
    try {
      const res = await fetch('/api/tunnel/tokens');
      const data = await res.json();
      if (data.success) {
        setTokens(data.data);
      }
    } catch {
      // ignore
    }
  };

  const fetchPackets = async () => {
    try {
      const res = await fetch('/api/tunnel/live-packets');
      const data = await res.json();
      if (data.success) {
        setPackets(data.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchNodes();
    fetchConfig();
    fetchTokens();
    fetchPackets();

    const interval = setInterval(() => {
      fetchStats();
      fetchPackets();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleUpdateConfig = async (newConfig: Partial<ProtocolConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/tunnel/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.data);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleAddNode = async (node: Partial<TunnelNode>): Promise<boolean> => {
    try {
      const res = await fetch('/api/tunnel/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(node),
      });
      const data = await res.json();
      if (data.success) {
        setNodes((prev) => [...prev, data.data]);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleDeleteNode = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tunnel/nodes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNodes((prev) => prev.filter((n) => n.id !== id));
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleTestPing = async (target: string): Promise<{ latencyMs: number; jitterMs: number }> => {
    try {
      const res = await fetch('/api/tunnel/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (data.success) {
        return { latencyMs: data.latencyMs, jitterMs: data.jitterMs };
      }
    } catch {
      // ignore
    }
    return { latencyMs: 45, jitterMs: 2 };
  };

  const handleAddToken = async (token: Partial<ClientToken>): Promise<boolean> => {
    try {
      const res = await fetch('/api/tunnel/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token),
      });
      const data = await res.json();
      if (data.success) {
        setTokens((prev) => [...prev, data.data]);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleDeleteToken = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tunnel/tokens/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTokens((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const isFa = lang === 'fa';

  if (!isAuthenticated && !authChecking) {
    return <LoginModal lang={lang} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        onQuickTrafficClick={() => setCurrentTab('traffic')}
        onOpenSecurity={() => setShowSecurityModal(true)}
        onLogout={handleLogout}
        activeNodesCount={nodes.filter((n) => n.status === 'ONLINE').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'overview' && (
          <OverviewView
            stats={stats}
            nodes={nodes}
            lang={lang}
            onNavigate={setCurrentTab}
            onTestNodePing={handleTestPing}
          />
        )}

        {currentTab === 'traffic' && (
          <TrafficTesterView lang={lang} />
        )}

        {currentTab === 'install' && (
          <InstallView lang={lang} />
        )}

        {currentTab === 'protocol' && (
          <ProtocolConfigView
            config={config}
            onUpdateConfig={handleUpdateConfig}
            lang={lang}
          />
        )}

        {currentTab === 'inspector' && (
          <WireInspectorView
            packets={packets}
            onRefresh={fetchPackets}
            lang={lang}
          />
        )}

        {currentTab === 'nodes' && (
          <NodesView
            nodes={nodes}
            onAddNode={handleAddNode}
            onDeleteNode={handleDeleteNode}
            onTestPing={handleTestPing}
            lang={lang}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            tokens={tokens}
            onAddToken={handleAddToken}
            onDeleteToken={handleDeleteToken}
            lang={lang}
          />
        )}
      </main>

      {/* Security & Password Modal */}
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        lang={lang}
        onLogout={handleLogout}
        onPasswordChanged={(newToken) => {
          localStorage.setItem('swp_auth_token', newToken);
        }}
      />

      {/* Clean Footer adhering to design guidelines */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SpectreWire Protocol (SWP/v2.4)</span>
            <span>·</span>
            <span>{isFa ? 'سامانه جامع مدیریت و هدایت ترافیک رمزنگاری‌شده' : 'Multiplexed Obfuscated Tunnel Gateway'}</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            {stats?.uptimeFormatted ? `${isFa ? 'زمان فعالیت سرور:' : 'Uptime:'} ${stats.uptimeFormatted}` : ''}
          </div>
        </div>
      </footer>
    </div>
  );
}
