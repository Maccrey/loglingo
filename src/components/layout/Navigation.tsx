"use client";


import { useState, useEffect } from "react";
import { Home, BookOpen, PenTool, Settings, GraduationCap, LogOut, LogIn, User, Globe } from "lucide-react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";

// Language options for UI (15 languages including Russian)

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "tr", name: "Türkçe" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "ru", name: "Русский" },
];

export function Navigation() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const { user, signOutUser, loading } = useAuth();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    window.addEventListener("open-login-modal", handleOpenLogin);
    return () => window.removeEventListener("open-login-modal", handleOpenLogin);
  }, []);

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/diary", label: t('diary'), icon: BookOpen },
    { href: "/diary/new", label: t('write'), icon: PenTool },
    { href: "/archive", label: t('archive'), icon: GraduationCap },
    { href: "/radio", label: t('radio'), icon: Globe },
    { href: "/settings", label: t('settings'), icon: Settings },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/20 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around px-4 md:justify-between">
          <Link href="/" className="hidden md:block">
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Loglingo
            </div>
          </Link>
          
          <div className="flex w-full justify-around md:w-auto md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    import("@/lib/analytics").then(({ trackEvent }) => {
                      trackEvent("click_button", {
                        component_name: "네비게이션",
                        action_detail: "메뉴 이동",
                        item_name: item.label,
                        value_korean: `메뉴 클릭: ${item.label}`,
                        link_href: item.href
                      });
                    });
                  }}
                  className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary md:flex-row md:space-x-2 md:space-y-0 md:text-sm"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
            <div className="relative">
              <select
                aria-label={tSettings('ui_language')}
                className="rounded-lg border border-white/15 bg-black/80 text-white text-xs px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/60 appearance-none"
                value={locale}
                onChange={(e) => {
                  const nextLocale = e.target.value;
                  const langName = languages.find(l => l.code === nextLocale)?.name || nextLocale;
                  import("@/lib/analytics").then(({ trackEvent }) => {
                    trackEvent("click_button", {
                      component_name: "네비게이션",
                      action_detail: "언어 변경",
                      item_name: langName,
                      value_korean: `언어 변경: ${langName}`,
                      target_locale: nextLocale
                    });
                  });
                  document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
                  router.replace(pathname, { locale: nextLocale });
                }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[180px] truncate">{user.email || user.displayName || "User"}</span>
                </div>
                <button
                  onClick={() => {
                    import("@/lib/analytics").then(({ trackEvent }) => {
                      trackEvent("click_button", {
                        component_name: "네비게이션",
                        action_detail: "로그아웃",
                        value_korean: "로그아웃 버튼 클릭"
                      });
                    });
                    signOutUser();
                  }}
                  className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 hover:border-primary/50 transition"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout') ?? "Logout"}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  import("@/lib/analytics").then(({ trackEvent }) => {
                    trackEvent("click_button", {
                      component_name: "네비게이션",
                      action_detail: "로그인 모달 열기",
                      value_korean: "로그인 버튼 클릭"
                    });
                  });
                  setIsLoginOpen(true);
                }}
                className="inline-flex items-center rounded-lg border border-primary/50 px-3 py-1.5 text-primary-foreground bg-primary/80 hover:bg-primary transition disabled:opacity-60"
                disabled={loading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? t('loading', { defaultMessage: 'Loading...' }) : t('login')}
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onSwitchToPasswordReset={() => {
          setIsLoginOpen(false);
          setIsPasswordResetOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <PasswordResetModal
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
        onSwitchToLogin={() => {
          setIsPasswordResetOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
