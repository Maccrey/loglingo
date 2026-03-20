"use client";


import { useState, useEffect, ChangeEvent } from "react";
import { Home, BookOpen, PenTool, Settings, GraduationCap, LogOut, LogIn, User, Globe, Newspaper } from "lucide-react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";
import { PasswordResetModal } from "@/components/auth/PasswordResetModal";
import { Flame } from "lucide-react";
import { useUserProfile } from "@/application/user/useUserProfile";
import { computeDisplayStreak } from "@/domain/user/streak";

import { LANGUAGES } from "@/constants/languages";

// Use shared constants for languages
const languages = LANGUAGES;

// Extracted Component
const LanguageSelector = ({ 
  locale, 
  tSettings, 
  onChange 
}: { 
  locale: string; 
  tSettings: any; 
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void; 
}) => (
  <div className="relative z-50">
    <select
      aria-label={tSettings('ui_language')}
      className="rounded-lg border border-white/15 bg-black/80 text-white text-xs px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/60 appearance-none"
      value={locale}
      onChange={onChange}
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
);

export function Navigation() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const { user, signOutUser, loading } = useAuth();
  const { data: userProfile } = useUserProfile(user?.uid);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);

  const displayStreak = computeDisplayStreak(userProfile?.streak, new Date().toISOString().split("T")[0]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    { href: "/blog", label: t('blog'), icon: Newspaper },
    { href: "/settings", label: t('settings'), icon: Settings },
  ];

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
  };



  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/20 px-4 backdrop-blur-lg md:hidden">
        <Link href="/">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
            Loglingo
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {mounted && user !== undefined && (
            user ? (
            <button
              onClick={() => {
                import("@/lib/analytics").then(({ trackEvent }) => {
                  trackEvent("click_button", {
                    component_name: "MobileHeader",
                    action_detail: "로그아웃",
                    value_korean: "모바일 헤더 로그아웃 클릭"
                  });
                });
                signOutUser();
              }}
              className="text-white/70 hover:text-white transition-colors"
              aria-label={t('logout') ?? "Logout"}
            >
              <LogOut className="h-5 w-5" />
            </button>
            ) : (
            <button
              onClick={() => {
                import("@/lib/analytics").then(({ trackEvent }) => {
                  trackEvent("click_button", {
                    component_name: "MobileHeader",
                    action_detail: "로그인 모달 열기",
                    value_korean: "모바일 헤더 로그인 클릭"
                  });
                });
                setIsLoginOpen(true);
              }}
              className="text-white/70 hover:text-white transition-colors"
              aria-label={t('login') ?? "Login"}
              disabled={loading}
            >
              <LogIn className="h-5 w-5" />
            </button>
            )
          )}
          <LanguageSelector 
            locale={locale} 
            tSettings={tSettings} 
            onChange={handleLanguageChange} 
          />
        </div>
      </header>

      {/* Desktop Top Nav / Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/20 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around px-4 md:justify-between">
          <Link href="/" className="hidden md:block">
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Loglingo
            </div>
          </Link>
          
          <div className="flex w-full justify-around md:w-auto md:gap-8">
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
                  className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary md:flex-row md:space-x-2 md:space-y-0 md:text-base"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
            <LanguageSelector 
              locale={locale} 
              tSettings={tSettings} 
              onChange={handleLanguageChange} 
            />

            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400">
                    <Flame className="h-4 w-4 fill-orange-400" />
                    <span>{displayStreak}</span>
                  </div>
                  <User className="h-4 w-4 ml-1" />
                  <span className="max-w-[150px] truncate">{user.email || user.displayName || "User"}</span>
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


