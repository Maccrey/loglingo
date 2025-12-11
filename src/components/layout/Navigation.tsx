"use client";


import { Home, BookOpen, PenTool, Settings, GraduationCap, LogOut, LogIn, User } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";

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
];

export function Navigation() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('nav');
  const tSettings = useTranslations('settings');
  const { user, signInWithGoogle, signOutUser, loading } = useAuth();

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/diary", label: t('diary'), icon: BookOpen },
    { href: "/diary/new", label: t('write'), icon: PenTool },
    { href: "/archive", label: t('archive'), icon: GraduationCap },
    { href: "/settings", label: t('settings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/20 backdrop-blur-lg md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around px-4 md:justify-between">
        <div className="hidden md:block text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Loglingo
        </div>
        
        <div className="flex w-full justify-around md:w-auto md:space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary md:flex-row md:space-x-2 md:space-y-0 md:text-sm"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
          <select
            aria-label={tSettings('ui_language')}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
            value={locale}
            onChange={(e) => {
              const nextLocale = e.target.value;
              document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
              router.replace("/", { locale: nextLocale });
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="max-w-[180px] truncate">{user.email || user.displayName || "User"}</span>
              </div>
              <button
                onClick={() => signOutUser()}
                className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 hover:border-primary/50 transition"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout') ?? "Logout"}
              </button>
            </>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
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
  );
}
