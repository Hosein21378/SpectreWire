import React from 'react';
import { TunnelStats, TunnelNode, Language } from '../types/tunnel';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Server, 
  Layers, 
  Zap, 
  ExternalLink,
  ChevronRight,
  HardDrive,
  Terminal
} from 'lucide-react';

interface OverviewViewProps {
  stats: TunnelStats | null;
  nodes: TunnelNode[];
  lang: Language;
  onNavigate: (tab: any) => void;
  onTestNodePing: (target: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  nodes,
  lang,
  onNavigate,
  onTestNodePing,
}) => {
  const isFa = lang === 'fa';

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Hero / Quick Status Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800/80 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>SPECTREWIRE MULTIPLEXED TRANSPORT ENGINE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">RFC-DRAFT-2490</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFa ? 'هسته مرکزی تونل و هدایت ترافیک رمزنگاری‌شده' : 'Central Tunnel Core & Obfuscated Traffic Controller'}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isFa
                ? 'پروتکل اختصاصی SWP با استفاده از فریم‌های باینری، تغییر آنتروپی پویا (Dynamic Padding) و شبیه‌سازی TLS 1.3 ترافیک شما را بدون امکان شناسایی توسط سامانه‌های فیلترینگ عمیق (DPI) از مبدأ به مقصد منتقل می‌کند.'
                : 'Proprietary SWP protocol multiplexes virtual streams over carrier connections with dynamic jitter padding and TLS 1.3 camouflage to evade deep packet inspection while delivering wire-speed throughput.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('install')}
              className="px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span>{isFa ? 'دستور نصب سرور' : '1-Click VPS Install'}</span>
            </button>
            <button
              onClick={() => onNavigate('traffic')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'تست عبور داده' : 'Test Traffic'}</span>
            </button>
            <button
              onClick={() => onNavigate('protocol')}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{isFa ? 'تنظیمات SWP' : 'Protocol'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Throughput */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isFa ? 'نرخ انتقال لحظه‌ای' : 'Current Throughput'}</span>
            <ActivityIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {stats?.rxSpeedMbps ? (stats.rxSpeedMbps + stats.txSpeedMbps).toFixed(1) : '110.7'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Mbps</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1 text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span className="tabular-nums">RX: {stats?.rxSpeedMbps || 42.5}M</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="tabular-nums">TX: {stats?.txSpeedMbps || 68.2}M</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Packet Rate (PPS) */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isFa ? 'پکت‌های در گردش' : 'Packet Processing'}</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {stats?.currentPps?.toLocaleString() || '1,420'}
            </span>
            <span className="text-xs text-slate-400 font-mono">pkt/s</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>{isFa ? 'مجموع پکت‌ها:' : 'Total Packets:'}</span>
            <span className="font-mono tabular-nums text-slate-300">
              {stats?.totalPackets ? (stats.totalPackets / 1000000).toFixed(2) + 'M' : '1.94M'}
            </span>
          </div>
        </div>

        {/* Metric 3: DPI Evasion & Stealth */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isFa ? 'مقاومت ضد DPI و فیلترینگ' : 'DPI Evasion Score'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {stats?.dpiEvasionScore || 99.4}%
            </span>
            <span className="text-xs text-emerald-500/80 font-mono">{isFa ? 'استتار کامل' : 'Full Stealth'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>{isFa ? 'پروب‌های مسدود شده:' : 'Active Probes Blocked:'}</span>
            <span className="font-mono tabular-nums text-slate-300">{stats?.probeBlockedCount || 89}</span>
          </div>
        </div>

        {/* Metric 4: Active Channels & Mux Streams */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{isFa ? 'کانال‌های مالتی‌پلکس Mux' : 'Virtual Mux Streams'}</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {stats?.activeStreams || 24}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {stats?.activeNodesCount || 3} {isFa ? 'نود متصل' : 'Nodes'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>{isFa ? 'میانگین تاخیر پینگ:' : 'Average Latency:'}</span>
            <span className="font-mono tabular-nums text-cyan-400">
              {stats?.avgLatencyMs || 38.5} ms
            </span>
          </div>
        </div>
      </div>

      {/* Network Topology & Flow Visualization */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>{isFa ? 'توپولوژی و مسیر عبور داده در شبکه اختصاصی' : 'Encrypted Pipeline Topology'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isFa
                ? 'نمای زنده جریان بسته‌های داده از کلاینت تا سرور خروجی همراه با لایه‌های مبهم‌سازی'
                : 'Live visualization of multi-hop encrypted packets traversing bridges and exit gateways'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isFa ? 'حالت فعال: شبیه‌سازی TLS 1.3 با پدینگ متغیر' : 'Active: TLS 1.3 Camouflage + Jitter'}</span>
          </div>
        </div>

        {/* Step-by-Step Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Node 1: Local Daemon */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400">01. CLIENT ENDPOINT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{isFa ? 'کلاینت و سورس ترافیک' : 'Local Daemon / App'}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">127.0.0.1:1080 (SOCKS5)</p>
            </div>
            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded">
              <div className="flex justify-between">
                <span>{isFa ? 'قالب‌بندی باینری:' : 'Framing:'}</span>
                <span className="font-mono text-slate-200">SWP v2.4</span>
              </div>
              <div className="flex justify-between">
                <span>{isFa ? 'رمزنگاری اولیه:' : 'Cipher:'}</span>
                <span className="font-mono text-slate-200">ChaCha20</span>
              </div>
            </div>
          </div>

          {/* Node 2: Dynamic Entropy Padding & Bridge */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400">02. IRAN BRIDGE NODE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{isFa ? 'پل ارتباطی داخل کشور' : 'Tehran Bridge Gateway'}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">185.190.140.22:8443</p>
            </div>
            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded">
              <div className="flex justify-between">
                <span>{isFa ? 'استتار SNI:' : 'Decoy SNI:'}</span>
                <span className="font-mono text-cyan-300">cloudflare.com</span>
              </div>
              <div className="flex justify-between">
                <span>{isFa ? 'پدینگ رندوم:' : 'Entropy Jitter:'}</span>
                <span className="font-mono text-slate-200">32-128 Bytes</span>
              </div>
            </div>
          </div>

          {/* Node 3: International Transit Relay */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400">03. TRANSIT RELAY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{isFa ? 'رله ترانزیت آمستردام' : 'Amsterdam Relay Mux'}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">185.220.101.5:8080</p>
            </div>
            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded">
              <div className="flex justify-between">
                <span>{isFa ? 'کانال‌های تجمیعی:' : 'Aggregated Mux:'}</span>
                <span className="font-mono text-slate-200">84 Streams</span>
              </div>
              <div className="flex justify-between">
                <span>{isFa ? 'تاخیر عبور:' : 'Transit Latency:'}</span>
                <span className="font-mono text-amber-300">52 ms</span>
              </div>
            </div>
          </div>

          {/* Node 4: Frankfurt Exit Gateway */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400">04. EXIT GATEWAY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{isFa ? 'خروجی فرانکفورت (اینترنت آزاد)' : 'Frankfurt High-Speed Exit'}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">159.69.88.114:443</p>
            </div>
            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/50 p-2 rounded">
              <div className="flex justify-between">
                <span>{isFa ? 'خروجی مقصد:' : 'Outbound NAT:'}</span>
                <span className="font-mono text-emerald-300">10 Gbps Tier 1</span>
              </div>
              <div className="flex justify-between">
                <span>{isFa ? 'دی‌کپسوله کردن:' : 'Unpack SWP:'}</span>
                <span className="font-mono text-slate-200">Real HTTP/TCP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nodes Overview Table */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'نودهای فعال در شبکه تونل' : 'Active Tunnel Endpoints'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa ? 'وضعیت پینگ، حجم مصرفی و بار پردازشی هر سرور' : 'Real-time telemetry and latency per node'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('nodes')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{isFa ? 'مدیریت کامل نودها' : 'Manage All Nodes'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="px-6 py-3.5 font-medium">{isFa ? 'نام و موقعیت نود' : 'Node Name & Location'}</th>
                <th className="px-6 py-3.5 font-medium">{isFa ? 'نقش' : 'Role'}</th>
                <th className="px-6 py-3.5 font-medium">{isFa ? 'آدرس IP و پورت' : 'IP & Port'}</th>
                <th className="px-6 py-3.5 font-medium text-right">{isFa ? 'تاخیر پینگ' : 'Latency'}</th>
                <th className="px-6 py-3.5 font-medium text-right">{isFa ? 'ترافیک کل (RX/TX)' : 'Total Traffic'}</th>
                <th className="px-6 py-3.5 font-medium text-center">{isFa ? 'عملیات' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <div>
                        <div className="font-semibold text-white">{node.name}</div>
                        <div className="text-slate-400 text-[11px]">{node.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {node.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">
                    {node.ip}:{node.port}
                  </td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums">
                    <span className={node.latencyMs < 40 ? 'text-emerald-400' : 'text-amber-400'}>
                      {node.latencyMs} ms
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-300">
                    {formatBytes(node.totalRxBytes + node.totalTxBytes)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onTestNodePing(node.ip)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded transition-colors cursor-pointer"
                    >
                      {isFa ? 'تست پینگ' : 'Ping'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
