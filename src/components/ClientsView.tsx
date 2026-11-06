import React, { useState, useEffect } from 'react';
import { ClientToken, Language } from '../types/tunnel';
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Terminal, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  ShieldCheck,
  QrCode,
  FileCode
} from 'lucide-react';

interface ClientsViewProps {
  tokens: ClientToken[];
  onAddToken: (token: Partial<ClientToken>) => Promise<boolean>;
  onDeleteToken: (id: string) => Promise<boolean>;
  lang: Language;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  tokens,
  onAddToken,
  onDeleteToken,
  lang,
}) => {
  const isFa = lang === 'fa';

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ClientToken>(tokens[0] || null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [quotaGb, setQuotaGb] = useState(100);
  const [maxSpeedMbps, setMaxSpeedMbps] = useState(150);
  const [maxConcurrentDevices, setMaxConcurrentDevices] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Script templates
  const [scripts, setScripts] = useState<{
    python: string;
    bash: string;
    dockerCompose: string;
    uri: string;
  } | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<'python' | 'bash' | 'docker' | 'uri'>('python');

  useEffect(() => {
    if (selectedToken) {
      fetch(`/api/tunnel/client-script?token=${selectedToken.tokenKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.scripts) {
            setScripts(data.scripts);
          }
        })
        .catch(() => null);
    }
  }, [selectedToken]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    const success = await onAddToken({
      name,
      assignedTo: assignedTo || 'Authorized User',
      quotaGb,
      maxSpeedMbps,
      maxConcurrentDevices,
    });
    setIsSubmitting(false);
    if (success) {
      setShowAddModal(false);
      setName('');
      setAssignedTo('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>ACCESS TOKENS & CLIENT DEPLOYMENT</span>
              <span className="text-slate-600">·</span>
              <span>CROSS-PLATFORM DAEMONS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {isFa ? 'مدیریت کلیدهای دسترسی و اسکریپت‌های اتصال کلاینت' : 'Access Tokens & Client Daemons'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isFa
                ? 'تولید کلیدهای احراز هویت اختصاصی SWP، اعمال محدودیت حجم و سرعت، و دریافت کلاینت‌های آماده پایتون، لینوکس و داکر برای اتصال و عبور ترافیک.'
                : 'Issue cryptographic SWP client tokens, enforce bandwidth quotas, and deploy instant zero-dependency daemons on any machine.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'ایجاد کلید جدید' : 'Generate Token'}</span>
          </button>
        </div>
      </div>

      {/* Tokens List Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'کلیدهای فعال کاربری' : 'Active Client Access Keys'}</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {tokens.length} {isFa ? 'کلید صادر شده' : 'Tokens Issued'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-medium">{isFa ? 'عنوان و کاربر' : 'Token & User'}</th>
                <th className="px-5 py-3 font-medium">{isFa ? 'کلید احراز هویت (Token Key)' : 'Authentication Key'}</th>
                <th className="px-5 py-3 font-medium">{isFa ? 'حجم مصرفی' : 'Quota Usage'}</th>
                <th className="px-5 py-3 font-medium">{isFa ? 'سقف سرعت' : 'Speed Cap'}</th>
                <th className="px-5 py-3 font-medium">{isFa ? 'دستگاه‌ها' : 'Devices'}</th>
                <th className="px-5 py-3 font-medium text-center">{isFa ? 'عملیات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {tokens.map((tok) => {
                const isSelected = selectedToken?.id === tok.id;
                const usagePercent = Math.min(100, Math.round((tok.usedGb / tok.quotaGb) * 100));

                return (
                  <tr
                    key={tok.id}
                    onClick={() => setSelectedToken(tok)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{tok.name}</div>
                      <div className="text-slate-400 text-[11px]">{tok.assignedTo}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-cyan-300">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[170px]" dir="ltr">
                          {tok.tokenKey}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tok.tokenKey, tok.id);
                          }}
                          className="text-slate-400 hover:text-white p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span>{tok.usedGb} GB</span>
                          <span className="text-slate-500">/ {tok.quotaGb} GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              usagePercent > 85 ? 'bg-red-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-200">
                      {tok.maxSpeedMbps} Mbps
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-300">
                      {tok.activeDevices} / {tok.maxConcurrentDevices}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteToken(tok.id);
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                        title={isFa ? 'ابطال کلید' : 'Revoke'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployment & Download Center for Selected Token */}
      {selectedToken && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>
                  {isFa ? 'راه‌اندازی و اتصال کلاینت برای:' : 'Client Daemon Deployment for:'}{' '}
                  <span className="text-cyan-300">{selectedToken.name}</span>
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFa
                  ? 'این اسکریپت روی سیستم کاربر اجرا شده و پورت SOCKS5 روی 127.0.0.1:1080 باز می‌کند.'
                  : 'Run this standalone client on your PC/server to create a local SOCKS5 proxy connected to the tunnel.'}
              </p>
            </div>

            {/* Script Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg">
              <button
                onClick={() => setActiveScriptTab('python')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeScriptTab === 'python'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python 3 (صفر وابستگی)
              </button>
              <button
                onClick={() => setActiveScriptTab('bash')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeScriptTab === 'bash'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Linux Curl
              </button>
              <button
                onClick={() => setActiveScriptTab('docker')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeScriptTab === 'docker'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Docker Compose
              </button>
              <button
                onClick={() => setActiveScriptTab('uri')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeScriptTab === 'uri'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SWP:// URI
              </button>
            </div>
          </div>

          {/* Script Content Box */}
          <div className="relative">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    activeScriptTab === 'python'
                      ? scripts?.python || ''
                      : activeScriptTab === 'bash'
                      ? scripts?.bash || ''
                      : activeScriptTab === 'docker'
                      ? scripts?.dockerCompose || ''
                      : scripts?.uri || '',
                    'script'
                  )
                }
                className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'script' ? (isFa ? 'کپی شد!' : 'Copied!') : isFa ? 'کپی' : 'Copy'}</span>
              </button>
            </div>

            <pre
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto max-h-80 leading-relaxed"
              dir="ltr"
            >
              {activeScriptTab === 'python' && (scripts?.python || 'Loading Python client...')}
              {activeScriptTab === 'bash' && (scripts?.bash || 'Loading Bash script...')}
              {activeScriptTab === 'docker' && (scripts?.dockerCompose || 'Loading Docker compose...')}
              {activeScriptTab === 'uri' && (scripts?.uri || 'Loading URI...')}
            </pre>
          </div>
        </div>
      )}

      {/* Add Token Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {isFa ? 'تولید کلید دسترسی جدید به تونل' : 'Generate New Client Key'}
            </h3>

            <form onSubmit={handleCreateToken} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">{isFa ? 'نام کلید / کاربر' : 'Client Name'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali - iPhone & Laptop"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">{isFa ? 'تخصیص به (کاربر / بخش)' : 'Assigned To'}</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Mobile VIP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{isFa ? 'حجم مجاز (GB)' : 'Quota (GB)'}</label>
                  <input
                    type="number"
                    value={quotaGb}
                    onChange={(e) => setQuotaGb(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{isFa ? 'سقف سرعت (Mbps)' : 'Max Speed (Mbps)'}</label>
                  <input
                    type="number"
                    value={maxSpeedMbps}
                    onChange={(e) => setMaxSpeedMbps(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg text-slate-950 font-semibold bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (isFa ? 'در حال صدور...' : 'Generating...') : isFa ? 'صدور کلید' : 'Generate Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
