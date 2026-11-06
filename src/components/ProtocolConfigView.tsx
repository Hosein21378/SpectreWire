import React, { useState } from 'react';
import { ProtocolConfig, Language } from '../types/tunnel';
import { 
  ShieldCheck, 
  Lock, 
  Sliders, 
  EyeOff, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Binary,
  Layers,
  Key
} from 'lucide-react';

interface ProtocolConfigViewProps {
  config: ProtocolConfig | null;
  onUpdateConfig: (newConfig: Partial<ProtocolConfig>) => Promise<boolean>;
  lang: Language;
}

export const ProtocolConfigView: React.FC<ProtocolConfigViewProps> = ({
  config,
  onUpdateConfig,
  lang,
}) => {
  const isFa = lang === 'fa';

  const [formData, setFormData] = useState<ProtocolConfig>(
    config || {
      protocolName: 'SpectreWire Protocol (SWP/v2)',
      version: '2.4.0-Enterprise',
      port: 8443,
      cipher: 'CHACHA20_POLY1305',
      obfuscationMode: 'TLS_1_3_CAMOUFLAGE',
      decoySni: 'cloudflare.com',
      fallbackUrl: 'https://www.bing.com',
      psk: 'swp_sec_99a8b1c4e7f24095a123d4e8',
      minPaddingBytes: 32,
      maxPaddingBytes: 128,
      muxMaxStreams: 256,
      heartbeatIntervalSec: 15,
      antiProbeEnabled: true,
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof ProtocolConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    const success = await onUpdateConfig(formData);
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const generateRandomKey = () => {
    const chars = '0123456789abcdef';
    let key = 'swp_sec_';
    for (let i = 0; i < 24; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    handleChange('psk', key);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>PROPRIETARY TRANSPORT SPECIFICATION</span>
            <span className="text-slate-600">·</span>
            <span>SWP v2.4 BINARY ENGINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'پیکربندی پروتکل اختصاصی و مکانیزم‌های ضد فیلترینگ' : 'Proprietary Protocol & Anti-Censorship Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isFa
              ? 'پروتکل اختصاصی SWP با استفاده از ساختار باینری سبک، رمزنگاری پیشرفته و تغییر پیوسته الگوی بسته‌ها از ردگیری توسط فایروال‌های ملی و سامانه‌های DPI جلوگیری می‌کند.'
              : 'Customize wire framing, cryptographic cipher suites, active probing defenses, and dynamic packet padding parameters.'}
          </p>
        </div>
      </div>

      {/* Protocol Framing Blueprint */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'آناتومی فریم باینری SWP v2 (۱۶ بایت هدر اختصاصی)' : 'SWP v2 Binary Frame Anatomy (16-Byte Header)'}</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">Big-Endian Network Byte Order</span>
        </div>

        {/* Visual Frame Block Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono" dir="ltr">
          <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-center">
            <div className="text-[10px] text-cyan-400 font-semibold">MAGIC (3B)</div>
            <div className="text-white font-bold mt-1">0x53 0x57 0x50</div>
            <div className="text-[10px] text-slate-400 mt-0.5">'SWP'</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold">VERSION (1B)</div>
            <div className="text-white font-bold mt-1">0x02</div>
            <div className="text-[10px] text-slate-400 mt-0.5">v2.4</div>
          </div>

          <div className="p-3 rounded-lg bg-purple-950/60 border border-purple-800/60 text-center">
            <div className="text-[10px] text-purple-400 font-semibold">FLAGS (1B)</div>
            <div className="text-white font-bold mt-1">0b01000001</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Enc + Pad</div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800/60 text-center">
            <div className="text-[10px] text-amber-400 font-semibold">STREAM ID (4B)</div>
            <div className="text-white font-bold mt-1">uint32_t</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mux Channel</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-semibold">COMMAND (1B)</div>
            <div className="text-white font-bold mt-1">0x02</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Data Transfer</div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-center">
            <div className="text-[10px] text-emerald-400 font-semibold">PADDING LEN (1B)</div>
            <div className="text-white font-bold mt-1">0-255 B</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Anti-DPI Jitter</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center sm:col-span-2 lg:col-span-1">
            <div className="text-[10px] text-slate-400 font-semibold">CHECKSUM (4B)</div>
            <div className="text-white font-bold mt-1">CRC32 / HMAC</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Integrity</div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Obfuscation & DPI Defense */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                {isFa ? 'لایه‌های استتار و مبهم‌سازی (Obfuscation)' : 'Obfuscation & Camouflage'}
              </h3>
            </div>

            {/* Obfuscation Mode */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isFa ? 'حالت عبور از فیلترینگ' : 'Evasion Transport Mode'}
              </label>
              <select
                value={formData.obfuscationMode}
                onChange={(e) => handleChange('obfuscationMode', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="TLS_1_3_CAMOUFLAGE">TLS 1.3 Camouflage (استتار به عنوان ترافیک امن بانکی/کلادفلر)</option>
                <option value="WEBSOCKET_BINARY">WebSocket Masked Stream (عبور امن از CDNها)</option>
                <option value="RAW_DYNAMIC_PADDING">Raw TCP with Dynamic Jitter (بیشترین سرعت + پدینگ)</option>
                <option value="HTTP2_GRPC_MIMIC">HTTP/2 gRPC Mimicry (شبیه‌سازی ارتباطات میکروسرویس)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa
                  ? 'الگوریتم انتخابی هدر بسته‌ها را طوری تغییر می‌دهد که فایروال آن را ترافیک عادی تشخیص دهد.'
                  : 'Camouflages packet signatures to appear as legitimate enterprise traffic.'}
              </p>
            </div>

            {/* Decoy SNI */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isFa ? 'دامنه جعلی برای استتار (Decoy SNI)' : 'Decoy SNI Domain'}
              </label>
              <input
                type="text"
                value={formData.decoySni}
                onChange={(e) => handleChange('decoySni', e.target.value)}
                placeholder="cloudflare.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa
                  ? 'این دامنه در لایه TLS Handshake به سامانه‌های نظارتی نمایش داده می‌شود.'
                  : 'SNI header broadcasted during TLS handshake probe.'}
              </p>
            </div>

            {/* Fallback URL for Active Probing */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isFa ? 'آدرس بازگشتی برای پروب‌های مشکوک (Active Probe Decoy)' : 'Anti-Probe Fallback Site'}
              </label>
              <input
                type="text"
                value={formData.fallbackUrl}
                onChange={(e) => handleChange('fallbackUrl', e.target.value)}
                placeholder="https://www.bing.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa
                  ? 'اگر اسکنرهای فیلترینگ با کلید نامعتبر پورت را بررسی کنند، این صفحه به آن‌ها نمایش داده می‌شود.'
                  : 'Scanners probing without valid PSK receive authentic response from this decoy.'}
              </p>
            </div>
          </div>

          {/* Section 2: Cryptography & Jitter Padding */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                {isFa ? 'رمزنگاری و پدینگ آنتروپی (Entropy Jitter)' : 'Cipher & Dynamic Jitter'}
              </h3>
            </div>

            {/* Cipher Suite */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isFa ? 'الگوریتم رمزنگاری جریان داده' : 'Symmetric Cipher'}
              </label>
              <select
                value={formData.cipher}
                onChange={(e) => handleChange('cipher', e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="CHACHA20_POLY1305">ChaCha20-Poly1305 (سریع‌ترین روی پردازنده‌های بدون AES-NI)</option>
                <option value="AES_256_GCM">AES-256-GCM (شتاب سخت‌افزاری استاندارد سرورها)</option>
                <option value="XOR_STREAM">XOR Rolling-Ratchet (کمترین بار پردازشی)</option>
              </select>
            </div>

            {/* Pre-Shared Key (PSK) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {isFa ? 'کلید احراز هویت اختصاصی (Pre-Shared Key)' : 'Tunnel PSK Master Secret'}
                </label>
                <button
                  type="button"
                  onClick={generateRandomKey}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isFa ? 'تولید کلید رندوم' : 'Regenerate'}</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.psk}
                onChange={(e) => handleChange('psk', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
            </div>

            {/* Dynamic Padding Range */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {isFa ? 'محدوده پدینگ رندوم (بایت)' : 'Dynamic Padding Range'}
                </label>
                <span className="text-xs font-mono text-cyan-400">
                  {formData.minPaddingBytes} - {formData.maxPaddingBytes} Bytes
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500">{isFa ? 'حداقل پدینگ' : 'Min Padding'}</span>
                  <input
                    type="number"
                    min="0"
                    max="128"
                    value={formData.minPaddingBytes}
                    onChange={(e) => handleChange('minPaddingBytes', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">{isFa ? 'حداکثر پدینگ' : 'Max Padding'}</span>
                  <input
                    type="number"
                    min="64"
                    max="512"
                    value={formData.maxPaddingBytes}
                    onChange={(e) => handleChange('maxPaddingBytes', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isFa
                  ? 'تغییر رندوم اندازه بسته‌ها اثر انگشت آماری (Histogram) را کاملاً محو می‌کند.'
                  : 'Randomizes packet sizes to defeat statistical traffic analysis and packet length heuristics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>
              {isFa
                ? 'تغییرات بلافاصله روی تمام نودهای شبکه و کلاینت‌ها بدون قطعی اعمال می‌شود.'
                : 'Hot-reloads configuration across all nodes with zero downtime.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isFa ? 'تنظیمات با موفقیت ذخیره و اعمال شد' : 'Configuration Applied!'}</span>
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                isSaving
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-md shadow-cyan-500/20'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>{isFa ? 'در حال اعمال...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{isFa ? 'ذخیره و انتشار روی شبکه' : 'Apply & Broadcast Config'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
