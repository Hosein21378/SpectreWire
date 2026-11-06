import React, { useState } from 'react';
import { Language } from '../types/tunnel';
import { 
  Terminal, 
  Copy, 
  Download, 
  CheckCircle2, 
  Zap, 
  Server, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Key,
  ExternalLink,
  Code2
} from 'lucide-react';

interface InstallViewProps {
  lang: Language;
}

export const InstallView: React.FC<InstallViewProps> = ({ lang }) => {
  const isFa = lang === 'fa';

  const [port, setPort] = useState(8443);
  const [password, setPassword] = useState('admin123');
  const [profile, setProfile] = useState('TLS_1_3_CAMOUFLAGE');
  const [enableBbr, setEnableBbr] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'command' | 'script'>('command');

  const origin = window.location.origin;
  const installUrl = `${origin}/install.sh?port=${port}&obfs=${profile}&password=${encodeURIComponent(
    password
  )}&bbr=${enableBbr}`;
  const oneLinerCommand = `bash <(curl -fsSL "${installUrl}")`;

  const handleCopy = () => {
    navigator.clipboard.writeText(oneLinerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadScript = () => {
    window.open(installUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>1-CLICK AUTOMATED VPS DEPLOYMENT</span>
            <span className="text-slate-600">·</span>
            <span>ZERO CONFIGURATION REQUIRED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {isFa ? 'دستور نصب تک‌خطی سرور و پنل مدیریت تونل' : 'One-Line Server & Panel Installer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isFa
              ? 'کافیست دستور زیر را در ترمینال سرور لینوکس (اوبونتو/دبیان) کپی و اجرا کنید. اسکریپت به صورت خودکار تمام پیش‌نیازها، بهینه‌ساز TCP BBR، سرویس پس‌زمینه خودکار و پنل وب را راه‌اندازی می‌کند.'
              : 'Execute the single-line command below on any Linux VPS (Ubuntu/Debian). The script auto-configures dependencies, TCP BBR kernel acceleration, systemd service, and web panel.'}
          </p>
        </div>
      </div>

      {/* Main Command Box */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{isFa ? 'دستور تک‌خطی برای کپی در سرور (Bash One-Liner):' : 'One-Line Terminal Command:'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('command')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'command'
                  ? 'bg-slate-800 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFa ? 'دستور تک‌خطی' : 'Command'}
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-slate-800 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFa ? 'مشاهده اسکریپت کامل' : 'Full Script'}
            </button>
          </div>
        </div>

        {activeTab === 'command' ? (
          <div className="space-y-3">
            <div className="relative group">
              <pre
                className="p-4 sm:p-5 bg-slate-950 rounded-xl border border-cyan-900/50 text-cyan-300 font-mono text-xs sm:text-sm overflow-x-auto selection:bg-cyan-500/30 font-semibold"
                dir="ltr"
              >
                {oneLinerCommand}
              </pre>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isFa ? 'کپی شد!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isFa ? 'کپی دستور' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isFa ? 'سازگار با Ubuntu 20.04/22.04/24.04 و Debian 11/12' : 'Compatible with Ubuntu 20.04/22.04/24.04 and Debian 11/12'}</span>
              </span>
              <button
                onClick={handleDownloadScript}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>{isFa ? 'دانلود مستقیم فایل install.sh' : 'Download install.sh'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <pre
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed"
                dir="ltr"
              >
{`#!/usr/bin/env bash
# SpectreWire SWP/v2.4 - Full Production Linux Installer
# Port: ${port} | Obfuscation: ${profile} | BBR: ${enableBbr}

set -e
echo "[1/6] Installing dependencies (curl, tar, ufw, nodejs)..."
apt-get update -y && apt-get install -y curl wget tar ufw procps python3
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Enable TCP BBR Kernel Acceleration
modprobe tcp_bbr || true
cat << 'SYSCTL_EOF' > /etc/sysctl.d/99-spectrewire.conf
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
net.ipv4.ip_forward = 1
net.ipv4.tcp_fastopen = 3
SYSCTL_EOF
sysctl --system

# Download Complete Release Bundle
mkdir -p /opt/spectrewire
curl -fsSL "${origin}/api/tunnel/release.tar.gz" | tar -xz -C /opt/spectrewire

# Create Systemd Production Service
cat << 'EOF' > /etc/systemd/system/spectrewire.service
[Unit]
Description=SpectreWire Proprietary Tunnel & Panel
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/spectrewire
Environment=NODE_ENV=production
Environment=PORT=${port}
ExecStart=/usr/bin/node /opt/spectrewire/server.js
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

ufw allow ${port}/tcp
systemctl daemon-reload && systemctl enable --now spectrewire.service
echo "[+] SpectreWire Enterprise successfully deployed on port ${port}!"
`}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Customization Parameters for Installer */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>{isFa ? 'سفارشی‌سازی پارامترهای دستور نصب' : 'Installer Configuration Parameters'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Port */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">{isFa ? 'پورت سرور و پنل' : 'Port'}</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          {/* Initial Password */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">{isFa ? 'رمز عبور اولیه پنل' : 'Initial Password'}</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
              dir="ltr"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {isFa ? 'از داخل پنل هم قابل تغییر است' : 'Can be changed in panel'}
            </span>
          </div>

          {/* Obfuscation Mode */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">{isFa ? 'پروتکل استتار' : 'Obfuscation'}</label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
            >
              <option value="TLS_1_3_CAMOUFLAGE">TLS 1.3 Camouflage</option>
              <option value="WEBSOCKET_BINARY">WebSocket Masked</option>
              <option value="RAW_DYNAMIC_PADDING">Dynamic Jitter Padding</option>
            </select>
          </div>

          {/* TCP BBR Toggle */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">{isFa ? 'شتاب‌دهنده TCP BBR' : 'TCP BBR Acceleration'}</label>
            <button
              type="button"
              onClick={() => setEnableBbr(!enableBbr)}
              className={`w-full py-2 px-3 rounded-lg border font-mono transition-colors text-center cursor-pointer ${
                enableBbr
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {enableBbr ? (isFa ? 'فعال (پیشنهادی)' : 'Enabled') : isFa ? 'غیرفعال' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Instructions */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>{isFa ? 'مراحل نصب و ورود مجدد به پنل:' : 'Setup & Re-Entry Steps:'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400">01. SSH LOGIN</span>
            <h4 className="font-semibold text-white">{isFa ? 'اتصال به سرور لینوکس' : 'Connect via SSH'}</h4>
            <p className="text-slate-400 text-[11px] font-mono">ssh root@YOUR_VPS_IP</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-purple-400">02. RUN COMMAND</span>
            <h4 className="font-semibold text-white">{isFa ? 'اجرای دستور تک‌خطی' : 'Execute 1-Liner'}</h4>
            <p className="text-slate-400 text-[11px]">
              {isFa ? 'دستور بالا را در ترمینال کپی و اجرا کنید.' : 'Paste and run the one-line command.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-amber-400">03. WEB ACCESS</span>
            <h4 className="font-semibold text-white">{isFa ? 'ورود به پنل تحت وب' : 'Open Web Dashboard'}</h4>
            <p className="text-slate-400 text-[11px] font-mono">http://YOUR_VPS_IP:{port}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-emerald-400">04. SET PASSWORD</span>
            <h4 className="font-semibold text-white">{isFa ? 'تنظیم رمز عبور دلخواه' : 'Change Password'}</h4>
            <p className="text-slate-400 text-[11px]">
              {isFa
                ? 'از داخل پنل در بخش امنیت، رمز اختصاصی خود را تعیین کنید.'
                : 'Set custom master password from the Security menu.'}
            </p>
          </div>
        </div>
      </div>

      {/* CLI Tool Card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'ابزار مدیریت سرور در محیط ترمینال (Linux CLI Tool)' : 'Server CLI Management Tool'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'پس از اجرای دستور نصب، می‌توانید مستقیماً در ترمینال سرور دستورات زیر را اجرا کنید:'
                : 'After installation, you can run these commands directly in your server terminal:'}
            </p>
          </div>
          <code className="text-xs font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800" dir="ltr">
            spectrewire
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono" dir="ltr">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-semibold block">spectrewire</span>
            <span className="text-slate-400 text-[11px] font-sans">
              {isFa ? 'منوی تعاملی مدیریت کامل' : 'Interactive text menu'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-semibold block">spectrewire status</span>
            <span className="text-slate-400 text-[11px] font-sans">
              {isFa ? 'بررسی وضعیت سلامت سرویس' : 'Check service status'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-purple-400 font-semibold block">spectrewire logs</div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-semibold block">spectrewire restart</span>
            <span className="text-slate-400 text-[11px] font-sans">
              {isFa ? 'ریستارت فوری هسته تونل' : 'Restart tunnel core'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
