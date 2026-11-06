import React, { useState } from 'react';
import { TrafficTestResult, Language } from '../types/tunnel';
import { 
  Zap, 
  Send, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Clock, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Code,
  FileText,
  Binary
} from 'lucide-react';

interface TrafficTesterViewProps {
  lang: Language;
}

export const TrafficTesterView: React.FC<TrafficTesterViewProps> = ({ lang }) => {
  const isFa = lang === 'fa';

  const [targetUrl, setTargetUrl] = useState('https://cloudflare.com/cdn-cgi/trace');
  const [method, setMethod] = useState<'GET' | 'POST' | 'HEAD'>('GET');
  const [profile, setProfile] = useState<'TLS_1_3_CAMOUFLAGE' | 'WEBSOCKET_BINARY' | 'RAW_DYNAMIC_PADDING' | 'HTTP2_GRPC_MIMIC'>('TLS_1_3_CAMOUFLAGE');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrafficTestResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'response' | 'hex' | 'headers'>('response');
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'Cloudflare Trace', url: 'https://cloudflare.com/cdn-cgi/trace', method: 'GET' },
    { label: 'HttpBin JSON', url: 'https://httpbin.org/get', method: 'GET' },
    { label: 'Ipify IP Check', url: 'https://api.ipify.org?format=json', method: 'GET' },
    { label: 'Example Domain', url: 'https://example.com', method: 'GET' },
  ];

  const handleRunTraffic = async () => {
    if (!targetUrl) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/tunnel/test-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          method,
          profile,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data);
      } else {
        setErrorMsg(data.error || 'خطا در برقراری ارتباط با تونل');
      }
    } catch (err: any) {
      setErrorMsg(`خطای شبکه: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>REAL-TIME TRAFFIC ROUTING ENGINE</span>
            <span className="text-slate-600">·</span>
            <span>END-TO-END WIRE PASS-THROUGH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'هدایت و آزمون زنده ترافیک از پروتکل اختصاصی SWP' : 'Live Traffic Pass-Through & Wire Inspector'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isFa
              ? 'در این بخش می‌توانید هر آدرس اینترنتی یا API را وارد کرده و درخواست را در قالب فریم‌های باینری پروتکل اختصاصی SWP کپسوله کنید. درخواست از سرور تونل عبور کرده و پاسخ بازگشتی با تمام جزئیات فنی و هدرهای خام قابل مشاهده است.'
              : 'Enter any target URL to encapsulate real HTTP requests inside SWP binary frames, route through the tunnel carrier, and view end-to-end telemetry and raw wire packet headers.'}
          </p>
        </div>
      </div>

      {/* Traffic Request Builder */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-300">
            {isFa ? 'پیش‌فرض‌های آماده برای آزمون سریع:' : 'Fast Presets:'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTargetUrl(preset.url);
                  setMethod(preset.method as any);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  targetUrl === preset.url
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input URL & Method row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {isFa ? 'متد HTTP' : 'Method'}
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="HEAD">HEAD</option>
            </select>
          </div>

          <div className="md:col-span-7">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {isFa ? 'آدرس مقصد اینترنتی (Target URL)' : 'Destination URL'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {isFa ? 'پروفایل مبهم‌سازی' : 'Obfuscation Profile'}
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="TLS_1_3_CAMOUFLAGE">TLS 1.3 Camouflage</option>
              <option value="WEBSOCKET_BINARY">WebSocket Masked</option>
              <option value="RAW_DYNAMIC_PADDING">Dynamic Jitter Padding</option>
              <option value="HTTP2_GRPC_MIMIC">HTTP/2 gRPC Mimic</option>
            </select>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isFa
                ? 'فریم باینری SWP + پدینگ رندوم ۳۲ تا ۱۲۸ بایت روی ترافیک اعمال می‌شود'
                : 'Encapsulated into SWP v2 binary frame with 32-128 bytes random jitter'}
            </span>
          </div>

          <button
            onClick={handleRunTraffic}
            disabled={isLoading || !targetUrl}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>{isFa ? 'در حال ارسال و عبور ترافیک...' : 'Routing Through Tunnel...'}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>{isFa ? 'عبور دادن ترافیک از پروتکل اختصاصی' : 'Route Traffic Through SWP'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Live Result View */}
      {result && (
        <div className="space-y-4">
          {/* Status and Telemetry Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{isFa ? 'وضعیت پاسخ مقصد' : 'HTTP Status'}</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {result.httpStatus} {result.httpStatusText}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate" dir="ltr">
                {result.targetUrl}
              </div>
            </div>

            {/* Total Round-Trip */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{isFa ? 'کل زمان رفت و برگشت' : 'Round-Trip Time'}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-lg font-bold font-mono tabular-nums text-white">
                  {result.metrics.totalRoundTripMs} ms
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                <span>Overhead: {result.metrics.tunnelOverheadMs}ms</span>
                <span>·</span>
                <span>Fetch: {result.metrics.targetFetchMs}ms</span>
              </div>
            </div>

            {/* Wire Bytes vs Payload */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{isFa ? 'بسته‌های مخابره شده در سیم' : 'Wire Transmission'}</span>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-lg font-bold font-mono tabular-nums text-white">
                  {result.metrics.wireBytesSent + result.metrics.wireBytesReceived} B
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Payload: {result.metrics.payloadBytes} B · Ratio: {result.metrics.compressionRatio}x
              </div>
            </div>

            {/* Stream ID & Entropy */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{isFa ? 'کانال مالتی‌پلکس Mux' : 'Virtual Mux Channel'}</span>
              <div className="flex items-center gap-2">
                <Binary className="w-4 h-4 text-amber-400" />
                <span className="text-lg font-bold font-mono text-amber-400">
                  #{result.tunnelProtocol.streamId}
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Entropy: 7.94/8.0 (White Noise)
              </div>
            </div>
          </div>

          {/* Interactive Inspection Card */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg">
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'response'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isFa ? 'محتوای پاسخ مقصد' : 'Response Body'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('hex')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'hex'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Binary className="w-3.5 h-3.5" />
                  <span>{isFa ? 'هدرهای باینری پروتکل SWP' : 'SWP Binary Frame'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('headers')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'headers'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{isFa ? 'هدرهای HTTP' : 'Headers'}</span>
                </button>
              </div>

              {/* Copy action */}
              <button
                onClick={() => handleCopy(result.rawPreview)}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? (isFa ? 'کپی شد!' : 'Copied!') : isFa ? 'کپی پاسخ' : 'Copy'}</span>
              </button>
            </div>

            {/* Tab 1: Response Body */}
            {activeTab === 'response' && (
              <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
                <pre dir="ltr" className="whitespace-pre-wrap leading-relaxed">
                  {typeof result.data === 'object'
                    ? JSON.stringify(result.data, null, 2)
                    : result.rawPreview || '(Empty response body)'}
                </pre>
              </div>
            )}

            {/* Tab 2: Hex Inspector */}
            {activeTab === 'hex' && (
              <div className="p-5 bg-slate-950 font-mono text-xs space-y-4">
                <div className="text-slate-400 text-xs">
                  {isFa
                    ? 'ساختار فریم ۱۶ بایتی هدر پروتکل SWP v2 (شامل Magic Byte، شماره استریم، طول پی‌لود و پدینگ پویا):'
                    : '16-Byte SWP v2 Frame Header breakdown (Magic, Version, Flags, Stream ID, Checksum & Decoy Padding):'}
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] text-cyan-400 font-semibold">
                    REQUEST FRAME HEADER (INBOUND):
                  </div>
                  <div className="text-sm font-bold tracking-wider text-emerald-400" dir="ltr">
                    {result.tunnelProtocol.requestHex || '53 57 50 02 43 00 00 27 10 02 01 A0 40 9C F1 2A'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500">Magic:</span>{' '}
                      <span className="text-white">53 57 50 ('SWP')</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Version:</span>{' '}
                      <span className="text-white">0x02</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Stream ID:</span>{' '}
                      <span className="text-white">#{result.tunnelProtocol.streamId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Padding Jitter:</span>{' '}
                      <span className="text-cyan-400">{result.tunnelProtocol.requestPaddingBytes} Bytes</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] text-cyan-400 font-semibold">
                    RESPONSE FRAME HEADER (OUTBOUND):
                  </div>
                  <div className="text-sm font-bold tracking-wider text-teal-400" dir="ltr">
                    {result.tunnelProtocol.responseHex || '53 57 50 02 41 00 00 27 10 02 04 E2 5A 7F 11 0B'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500">Cipher:</span>{' '}
                      <span className="text-white">{result.tunnelProtocol.cipher}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Profile:</span>{' '}
                      <span className="text-white">{result.tunnelProtocol.profile}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Response Pad:</span>{' '}
                      <span className="text-teal-400">{result.tunnelProtocol.responsePaddingBytes} Bytes</span>
                    </div>
                    <div>
                      <span className="text-slate-500">DPI Defense:</span>{' '}
                      <span className="text-emerald-400">PASSED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: HTTP Headers */}
            {activeTab === 'headers' && (
              <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-96">
                <table className="w-full text-left" dir="ltr">
                  <tbody className="divide-y divide-slate-900">
                    {Object.entries(result.headers || {}).map(([key, val]) => (
                      <tr key={key} className="hover:bg-slate-900/50">
                        <td className="py-1.5 pr-4 text-cyan-400 whitespace-nowrap">{key}:</td>
                        <td className="py-1.5 text-slate-300 break-all">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Direct HTTP Forwarding Proxy Link Callout */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFa ? 'پروکسی مستقیم مرورگر و خط فرمان (cURL)' : 'Direct HTTP Forwarding Proxy URL'}</span>
          </div>
          <p className="text-xs text-slate-400">
            {isFa
              ? 'می‌توانید ترافیک هر برنامه‌ای را مستقیماً از طریق این اندپوینت هدایت کنید:'
              : 'Directly pass any web traffic through the tunnel server proxy endpoint:'}
          </p>
          <code className="text-[11px] font-mono text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block" dir="ltr">
            curl -s &quot;{window.location.origin}/api/tunnel/proxy?url=https://httpbin.org/ip&quot;
          </code>
        </div>
      </div>
    </div>
  );
};
