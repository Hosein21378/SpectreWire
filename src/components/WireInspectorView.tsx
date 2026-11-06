import React, { useState } from 'react';
import { WirePacket, Language } from '../types/tunnel';
import { 
  Binary, 
  ArrowDownRight, 
  ArrowUpRight, 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Pause,
  ExternalLink,
  ShieldAlert,
  Hash
} from 'lucide-react';

interface WireInspectorViewProps {
  packets: WirePacket[];
  onRefresh: () => void;
  lang: Language;
}

export const WireInspectorView: React.FC<WireInspectorViewProps> = ({
  packets,
  onRefresh,
  lang,
}) => {
  const isFa = lang === 'fa';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'INBOUND' | 'OUTBOUND'>('ALL');
  const [selectedPacket, setSelectedPacket] = useState<WirePacket | null>(packets[0] || null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const filteredPackets = packets.filter((pkt) => {
    const matchesDir = selectedDirection === 'ALL' || pkt.direction === selectedDirection;
    const matchesSearch =
      searchTerm === '' ||
      pkt.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkt.targetPreview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pkt.streamId).includes(searchTerm);
    return matchesDir && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>REAL-TIME PACKET CAPTURE & DISSECTOR</span>
            <span className="text-slate-600">·</span>
            <span>DEEP WIRE TELEMETRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'شنود و کالبدشکافی زنده پکت‌های شبکه (Wire Inspector)' : 'Real-time Packet Capture & Wire Dissector'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isFa
              ? 'مشاهده بسته‌های باینری پروتکل SWP، مقایسه ترافیک واقعی با پدینگ ضد DPI، تفکیک استریم‌های مالتی‌پلکس و بررسی سلامت هدرهای رمزنگاری.'
              : 'Inspect live serialized binary frames, verify jitter padding distribution, and dissect protocol header metadata.'}
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isFa ? 'جستجو بر اساس استریم، دامنه یا فرمان...' : 'Filter by Stream ID, target or command...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg">
            {(['ALL', 'INBOUND', 'OUTBOUND'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setSelectedDirection(dir)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedDirection === dir
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dir === 'ALL'
                  ? isFa
                    ? 'همه'
                    : 'All'
                  : dir === 'INBOUND'
                  ? isFa
                    ? 'ورودی (IN)'
                    : 'Inbound'
                  : isFa
                  ? 'خروجی (OUT)'
                  : 'Outbound'}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isFa ? 'تازه‌سازی پکت‌ها' : 'Refresh Packets'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Packet Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Packets Table */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto max-h-[520px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-medium">{isFa ? 'زمان' : 'Time'}</th>
                  <th className="px-4 py-3 font-medium">{isFa ? 'جهت' : 'Dir'}</th>
                  <th className="px-4 py-3 font-medium">{isFa ? 'کانال MUX' : 'Stream'}</th>
                  <th className="px-4 py-3 font-medium">{isFa ? 'فرمان / مقصد' : 'Command / Target'}</th>
                  <th className="px-4 py-3 font-medium text-right">{isFa ? 'سیم (Wire)' : 'Wire Size'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredPackets.map((pkt) => {
                  const isSelected = selectedPacket?.id === pkt.id;
                  const isIn = pkt.direction === 'INBOUND';
                  return (
                    <tr
                      key={pkt.id}
                      onClick={() => setSelectedPacket(pkt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 text-cyan-200'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-slate-400 tabular-nums whitespace-nowrap">
                        {pkt.timestamp}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
                            isIn
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                              : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                          }`}
                        >
                          {isIn ? (
                            <ArrowDownRight className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          <span>{pkt.direction === 'INBOUND' ? 'IN' : 'OUT'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-amber-400 whitespace-nowrap">
                        #{pkt.streamId}
                      </td>
                      <td className="px-4 py-2.5 text-white max-w-[200px] truncate" title={pkt.command}>
                        {pkt.command}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                        <span className="text-white font-semibold">{pkt.wireBytes} B</span>
                        <span className="text-slate-500 text-[10px] ml-1">
                          (+{pkt.paddingBytes}p)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Packet Deep Dissector */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'کالبدشکافی فریم انتخاب‌شده' : 'Packet Dissection'}</span>
            </h3>
            {selectedPacket && (
              <span className="text-xs font-mono text-cyan-400">
                Stream #{selectedPacket.streamId}
              </span>
            )}
          </div>

          {selectedPacket ? (
            <div className="space-y-4 text-xs font-mono">
              {/* Header Hex Display */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-semibold block">
                  RAW SWP FRAME HEADER (HEX 16-BYTES):
                </span>
                <div className="text-sm font-bold text-emerald-400 tracking-wider break-all" dir="ltr">
                  {selectedPacket.rawHexHeader}
                </div>
              </div>

              {/* Protocol Dissection Field breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'پروتکل اختصاصی:' : 'Protocol Signature:'}</span>
                  <span className="text-white font-semibold">SWP v2.4 (SpectreWire)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'شناسه مالتی‌پلکس (Stream ID):' : 'Multiplex Stream ID:'}</span>
                  <span className="text-amber-400 font-semibold">#{selectedPacket.streamId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'فرمان فریم:' : 'Frame Command:'}</span>
                  <span className="text-cyan-300">{selectedPacket.command}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'حجم کل در سیم (Wire):' : 'Total Wire Size:'}</span>
                  <span className="text-white">{selectedPacket.wireBytes} Bytes</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'پدینگ ضد DPI (آنتروپی):' : 'Decoy Jitter Padding:'}</span>
                  <span className="text-teal-400 font-semibold">+{selectedPacket.paddingBytes} Bytes</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'چک‌سام CRC32:' : 'Integrity Checksum:'}</span>
                  <span className="text-purple-400">{selectedPacket.checksum}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">{isFa ? 'پروفایل استتار:' : 'Active Camouflage:'}</span>
                  <span className="text-emerald-400">{selectedPacket.obfuscation}</span>
                </div>
              </div>

              {/* Security Audit Badge */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-300 font-sans leading-relaxed">
                  {isFa
                    ? 'بسته دارای اعتبارنامه امضای دیجیتال و پدینگ متغیر است و هیچ الگوی قابل شناسایی برای سیستم‌های DPI ندارد.'
                    : 'Frame conforms to randomized entropy constraints and passed zero-probe validation.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              {isFa ? 'یک بسته را از جدول انتخاب کنید' : 'Select a packet from the table to dissect'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
