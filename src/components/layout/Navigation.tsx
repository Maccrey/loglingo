"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, PenTool, Settings, GraduationCap, LogOut, LogIn, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuth } from "@/application/auth/AuthProvider";

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('nav');
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
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors hover:text-primary md:flex-row md:space-x-2 md:space-y-0 md:text-sm",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
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
