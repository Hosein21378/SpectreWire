import React from 'react';
import { TabType, Language } from '../types/tunnel';
import { Globe, Activity, Lock, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  lang: Language;
  onToggleLang: () => void;
  onQuickTrafficClick: () => void;
  onOpenSecurity: () => void;
  onLogout: () => void;
  activeNodesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  onQuickTrafficClick,
  onOpenSecurity,
  onLogout,
  activeNodesCount,
}) => {
  const isFa = lang === 'fa';

  const navItems: { id: TabType; label: string }[] = [
    { id: 'overview', label: isFa ? 'داشبورد شبکه' : 'Overview' },
    { id: 'traffic', label: isFa ? 'تست عبور ترافیک' : 'Traffic Router' },
    { id: 'install', label: isFa ? 'نصب تک‌خطی سرور' : '1-Click Install' },
    { id: 'protocol', label: isFa ? 'پروتکل اختصاصی' : 'SWP Protocol' },
    { id: 'inspector', label: isFa ? 'شنود پکت‌ها' : 'Wire Inspector' },
    { id: 'nodes', label: isFa ? 'نودهای تونل' : 'Nodes & Relays' },
    { id: 'clients', label: isFa ? 'کلاینت و کلیدها' : 'Clients & Keys' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onTabChange('overview')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2">
            <span>SpectreWire</span>
            <span className="text-xs font-mono font-medium text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
              SWP/v2
            </span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Security / Set Password Button */}
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-md transition-colors cursor-pointer"
            title={isFa ? 'تنظیم رمز عبور و امنیت پنل' : 'Security & Change Password'}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isFa ? 'رمز پنل' : 'Password'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors cursor-pointer"
            title={isFa ? 'تغییر زبان به انگلیسی' : 'Switch to Persian'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono">{isFa ? 'EN' : 'فا'}</span>
          </button>

          {/* Quick Traffic Test primary CTA */}
          <button
            onClick={onQuickTrafficClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-slate-950/80"></span>
            <span>{isFa ? 'تست ترافیک' : 'Live Test'}</span>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-900 transition-colors cursor-pointer"
            title={isFa ? 'خروج از پنل' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation tab scrollbar */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-900 bg-slate-950/80 no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
