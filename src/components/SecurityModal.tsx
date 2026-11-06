import React, { useState } from 'react';
import { Language } from '../types/tunnel';
import { 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut,
  X,
  Info
} from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLogout: () => void;
  onPasswordChanged: (newSessionToken: string) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLogout,
  onPasswordChanged,
}) => {
  const isFa = lang === 'fa';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [enableProtection, setEnableProtection] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 4) {
      setErrorMsg(isFa ? 'رمز عبور جدید باید حداقل ۴ کاراکتر باشد' : 'New password must be at least 4 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(isFa ? 'تکرار رمز عبور جدید همخوانی ندارد' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('swp_auth_token') || '';
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          enableProtection,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(
          isFa
            ? 'رمز عبور با موفقیت ثبت شد! برای ورود مجدد از این رمز استفاده کنید.'
            : 'Password updated successfully! Use this password for future logins.'
        );
        if (data.token) {
          localStorage.setItem('swp_auth_token', data.token);
          onPasswordChanged(data.token);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccessMsg(null);
        }, 4000);
      } else {
        setErrorMsg(data.error || 'خطا در ثبت رمز عبور');
      }
    } catch (err: any) {
      setErrorMsg(`خطای ارتباط با سرور: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isFa ? 'امنیت و تنظیم رمز عبور پنل' : 'Panel Password & Security'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isFa ? 'تنظیم رمز عبور برای ورود مجدد به پنل مدیریت' : 'Set password for re-entering the dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Information Notice */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              {isFa
                ? 'رمز عبور پیش‌فرض سرور پس از نصب admin123 است. می‌توانید در اینجا رمز دلخواه جدیدی تنظیم کنید تا هنگام باز کردن مجدد پنل، این رمز درخواست شود.'
                : 'Default server password after installation is admin123. Set your custom password below to enforce authentication.'}
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isFa ? 'رمز عبور فعلی (یا پیش‌فرض admin123)' : 'Current Password'}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="admin123"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isFa ? 'رمز عبور جدید' : 'New Password'}
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isFa ? 'حداقل ۴ کاراکتر' : 'At least 4 characters'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isFa ? 'تکرار رمز عبور جدید' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              dir="ltr"
            />
          </div>

          {/* Protection Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="protect_toggle"
              checked={enableProtection}
              onChange={(e) => setEnableProtection(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="protect_toggle" className="text-xs text-slate-300 select-none cursor-pointer">
              {isFa ? 'فعال بودن قفل رمز عبور برای ورود به پنل' : 'Enforce password protection on dashboard entry'}
            </label>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isFa ? 'خروج از پنل و تست ورود' : 'Logout & Test Re-entry'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
              >
                {isFa ? 'بستن' : 'Close'}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{isFa ? 'ثبت رمز عبور' : 'Save Password'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
