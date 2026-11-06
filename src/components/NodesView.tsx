import React, { useState } from 'react';
import { TunnelNode, Language } from '../types/tunnel';
import { 
  Server, 
  Plus, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowDownRight, 
  ArrowUpRight, 
  Radio, 
  ShieldCheck,
  Globe,
  Activity
} from 'lucide-react';

interface NodesViewProps {
  nodes: TunnelNode[];
  onAddNode: (node: Partial<TunnelNode>) => Promise<boolean>;
  onDeleteNode: (id: string) => Promise<boolean>;
  onTestPing: (target: string) => Promise<{ latencyMs: number; jitterMs: number }>;
  lang: Language;
}

export const NodesView: React.FC<NodesViewProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
  onTestPing,
  lang,
}) => {
  const isFa = lang === 'fa';

  const [showAddModal, setShowAddModal] = useState(false);
  const [pingingNodeId, setPingingNodeId] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<Record<string, { latency: number; jitter: number }>>({});

  const [name, setName] = useState('');
  const [role, setRole] = useState<'BRIDGE' | 'RELAY' | 'EXIT'>('RELAY');
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('DE');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(8443);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip) return;
    setIsSubmitting(true);
    const success = await onAddNode({
      name,
      role,
      location: location || 'Custom Gateway',
      countryCode,
      ip,
      port,
    });
    setIsSubmitting(false);
    if (success) {
      setShowAddModal(false);
      setName('');
      setIp('');
    }
  };

  const handlePing = async (node: TunnelNode) => {
    setPingingNodeId(node.id);
    const res = await onTestPing(node.ip);
    setPingResults((prev) => ({
      ...prev,
      [node.id]: { latency: res.latencyMs, jitter: res.jitterMs },
    }));
    setPingingNodeId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>TUNNEL INFRASTRUCTURE & FABRIC</span>
              <span className="text-slate-600">·</span>
              <span>MULTI-HOP RELAY TOPOLOGY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {isFa ? 'مدیریت سرورها و نودهای شبکه تونل' : 'Tunnel Nodes & Gateway Topology'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {isFa
                ? 'پیکربندی سرورهای پل داخلی (Bridge)، سرورهای رله عبوری (Relay) و سرورهای خروجی اینترنت آزاد (Exit Gateway).'
                : 'Manage distributed ingress bridges, intermediate transit relays, and foreign egress exit gateways.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFa ? 'افزودن نود جدید' : 'Add New Node'}</span>
          </button>
        </div>
      </div>

      {/* Nodes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const pingData = pingResults[node.id];
          const currentLatency = pingData ? pingData.latency : node.latencyMs;

          return (
            <div
              key={node.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white font-mono">
                    {node.countryCode}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{node.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {node.ip}:{node.port} · {node.location}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${
                    node.role === 'BRIDGE'
                      ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                      : node.role === 'EXIT'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'
                  }`}
                >
                  {node.role}
                </span>
              </div>

              {/* Telemetry Stats Row */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">{isFa ? 'تاخیر پینگ' : 'Latency'}</span>
                  <span className={`font-semibold ${currentLatency < 45 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentLatency} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isFa ? 'استریم‌های فعال' : 'Active Mux'}</span>
                  <span className="text-white font-semibold">{node.activeStreams}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isFa ? 'بار سرور' : 'Load'}</span>
                  <span className="text-cyan-400 font-semibold">{node.loadPercent}%</span>
                </div>
              </div>

              {/* Bandwidth & Actions */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-400 font-mono">
                  <span>RX: {formatBytes(node.totalRxBytes)}</span>
                  <span className="mx-1.5 text-slate-600">/</span>
                  <span>TX: {formatBytes(node.totalTxBytes)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePing(node)}
                    disabled={pingingNodeId === node.id}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {pingingNodeId === node.id ? (
                      <div className="w-3 h-3 border border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Activity className="w-3 h-3" />
                    )}
                    <span>{isFa ? 'سنجش پینگ' : 'Ping'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteNode(node.id)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                    title={isFa ? 'حذف نود' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {isFa ? 'افزودن سرور / نود جدید به شبکه' : 'Add New Tunnel Node'}
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">{isFa ? 'نام شناسایی نود' : 'Node Name'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="DE-Berlin-Edge-01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{isFa ? 'نقش در شبکه' : 'Role'}</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    <option value="BRIDGE">BRIDGE (پل ارتباطی)</option>
                    <option value="RELAY">RELAY (رله میانی)</option>
                    <option value="EXIT">EXIT (خروجی نهایی)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{isFa ? 'کد کشور (ISO)' : 'Country'}</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">{isFa ? 'موقعیت جغرافیایی' : 'Location'}</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Berlin, Germany"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 mb-1">{isFa ? 'آدرس IP سرور' : 'Server IP'}</label>
                  <input
                    type="text"
                    required
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="188.114.97.2"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{isFa ? 'پورت SWP' : 'Port'}</label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
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
                  {isSubmitting ? (isFa ? 'در حال ثبت...' : 'Adding...') : isFa ? 'ثبت نود' : 'Add Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
