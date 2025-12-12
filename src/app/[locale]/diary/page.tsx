"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Plus, CalendarDays, Edit3, Trash2, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useDiaryList, useDiaryMutations } from "@/application/diary/hooks";
import { useAuth } from "@/application/auth/AuthProvider";

import { Diary } from "@/domain/diary";
import { toast } from "sonner";
import NextImage from "next/image";
import { formatDate } from "@/lib/intl-format";
import { AuthGate } from "@/components/auth/AuthGate";

export default function DiaryListPage() {
  const t = useTranslations("diary");
  const locale = useLocale();
  const router = useRouter(); // Added router variable
  const { user, loading } = useAuth();
  const userId = user?.uid ?? "";
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [specificDate, setSpecificDate] = useState<string | null>(null);

  const enabled = Boolean(userId) && !loading;
  const { data: diaries = [], isLoading } = useDiaryList(userId, undefined, {
    enabled,
  });
  
  // 디버깅 로그
  console.log("📝 Diary Page State:", {
    userId,
    loading,
    enabled,
    isLoading,
    diariesCount: diaries.length,
    diaries: diaries.slice(0, 2), // 처음 2개만 표시
  });
  
  const { remove } = useDiaryMutations(userId);
  const monthLabels = useMemo(
    () =>
      Array.from({ length: 12 }, (_, idx) =>
        new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2020, idx, 1))
      ),
    [locale]
  );

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    diaries.forEach((diary) => years.add(Number(diary.date.split("-")[0])));
    return Array.from(years).sort((a, b) => b - a);
  }, [diaries, currentYear]);

  const byYear = useMemo(() => {
    if (year === null) return diaries;
    return diaries.filter((diary) => Number(diary.date.split("-")[0]) === year);
  }, [diaries, year]);

  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    byYear.forEach((diary) => {
      const m = new Date(`${diary.date}T00:00:00`).getMonth();
      counts[m] = (counts[m] || 0) + 1;
    });
    return counts;
  }, [byYear]);

  const filtered = useMemo(() => {
    // If specific date is selected, it takes precedence
    if (specificDate) {
      return diaries.filter((diary) => diary.date === specificDate);
    }
    
    if (month === null) return byYear;
    return byYear.filter(
      (diary) => new Date(`${diary.date}T00:00:00`).getMonth() === month
    );
  }, [byYear, month, diaries, specificDate]);

  const handleDelete = async (diary: Diary) => {
    if (!confirm(t("confirm_delete"))) return;
    try {
      await remove.mutateAsync(diary.id);
      toast.success(t("delete_success"));
    } catch {
      toast.error(t("delete_error"));
    }
  };

  const loadingState = loading || isLoading || !enabled;

  return (
    <AuthGate>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        <Link href="/diary/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("new_entry")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {t("filter_year")}
            </CardTitle>
            <div className="relative flex items-center gap-2">
              {specificDate && (
                 <button 
                   onClick={() => setSpecificDate(null)}
                   className="text-muted-foreground hover:text-foreground transition-colors"
                   title={t("clear_date_filter", { default: "Clear Date" })}
                 >
                   <X className="h-4 w-4" />
                 </button>
              )}
              <div className="relative group cursor-pointer">
                <CalendarDays className={`h-4 w-4 ${specificDate ? 'text-primary' : 'text-primary'} transition-colors`} />
                <input 
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    setSpecificDate(e.target.value);
                    setYear(null);
                    setMonth(null);
                  }}
                  value={specificDate || ""}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`space-y-2 transition-opacity duration-200 ${specificDate ? 'opacity-50 pointer-events-none' : ''}`}>
              <select
                className="w-full rounded-lg border border-white/10 bg-neutral-900 p-2 text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                value={year === null ? "" : year}
                onChange={(e) => {
                  const next = e.target.value === "" ? null : Number(e.target.value);
                  setYear(next);
                }}
              >
                <option value="" className="text-white bg-neutral-900">{t("all_years", { default: "All years" })}</option>
                {yearOptions.map((option) => (
                  <option key={option} value={option} className="text-white bg-neutral-900">
                    {option}
                  </option>
                ))}
              </select>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">{t("filter_month")}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <button
                    className={`rounded-md border border-white/10 px-3 py-2 text-center transition ${
                      month === null
                        ? "bg-primary/20 text-primary-foreground border-primary/20"
                        : "hover:bg-white/5"
                    }`}
                    onClick={() => setMonth(null)}
                  >
                    <span className="text-xs">{t("all_months")}</span>
                  </button>
                  {monthLabels.map((label, index) => (
                    <button
                      key={label}
                      className={`rounded-md border border-white/10 px-2 py-2 text-center transition flex justify-between items-center ${
                        month === index
                          ? "bg-primary/20 text-primary-foreground border-primary/20"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => setMonth(index)}
                    >
                      <span className="text-xs">{label}</span>
                      <span className="text-[10px] opacity-60">
                        {monthCounts[index] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {specificDate && (
              <div className="pt-2 border-t border-white/10 text-center">
                 <p className="text-xs text-muted-foreground mb-1">Selected Date</p>
                 <p className="text-sm font-medium text-primary">
                    {formatDate(specificDate, locale)}
                 </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {loadingState ? (
            <Card className="border-dashed bg-transparent p-6 text-center">
              <p className="text-muted-foreground">{t("loading")}</p>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="flex min-h-[200px] flex-col items-center justify-center border-dashed bg-transparent text-center">
              <p className="text-muted-foreground">{t("empty")}</p>
              <Link href="/diary/new" className="mt-3 inline-flex">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("new_entry")}
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filtered.map((diary) => (
              <div 
                key={diary.id} 
                onClick={() => router.push(`/diary/${diary.id}`)}
                className="block"
              >
                <Card className="glass-card border-white/10 transition-all hover:shadow-lg hover:border-primary/40 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(diary.date, locale)}
                      </p>
                      <CardTitle className="line-clamp-1 text-xl">
                        {diary.content.slice(0, 40) || t("untitled")}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/diary/${diary.id}/edit`);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(diary);
                        }}
                        disabled={remove.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {diary.imageUrl && (
                      <NextImage
                        src={diary.imageUrl}
                        alt="Diary attachment"
                        width={1200}
                        height={800}
                        className="h-48 w-full rounded-lg object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 700px"
                        unoptimized
                      />
                    )}
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {diary.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t("year_label")}: {diary.date.split("-")[0]}
                    </span>
                    <span>
                      {t("month_label")}: {monthLabels[new Date(`${diary.date}T00:00:00`).getMonth()]}
                    </span>
                  </CardFooter>
                </Card>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </AuthGate>
  );
}
