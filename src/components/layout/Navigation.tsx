"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, PenTool, Settings, GraduationCap } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/diary", label: "Diary", icon: BookOpen },
    { href: "/diary/new", label: "Write", icon: PenTool },
    { href: "/archive", label: "Learn", icon: GraduationCap },
    { href: "/settings", label: "Settings", icon: Settings },
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
                  "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors hover:text-primary md:flex-row md:space-y-0 md:space-x-2 md:text-sm",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6 md:h-5 md:w-5", isActive && "fill-current/20")} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
