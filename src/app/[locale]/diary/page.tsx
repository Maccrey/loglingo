"use client";

import { useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Plus, CalendarDays, Edit3, Trash2, X, ChevronDown } from "lucide-react";
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
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [specificDate, setSpecificDate] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

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
  }, [diaries]);

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
        <Card className="md:col-span-1 h-fit bg-[#111827] border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="p-5 space-y-6">
            {/* Year Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-lg">{t("filter_year", { default: "Year"})}</span>
                <div className="relative group">
                   {specificDate && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSpecificDate(null);
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors mr-1"
                        title={t("clear_date_filter", { default: "Clear Date" })}
                      >
                        <X className="h-4 w-4" />
                      </button>
                   )}
                   <div 
                     className="relative cursor-pointer p-1 rounded-md hover:bg-white/5 transition-colors"
                   >
                     <CalendarDays className={`h-5 w-5 ${specificDate ? 'text-orange-500 fill-orange-500/20' : 'text-orange-500'}`} />
                     <input 
                        ref={dateInputRef}
                        type="date" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) => {
                          if (e.target.value) {
                             setSpecificDate(e.target.value);
                             setYear(null);
                             setMonth(null);
                          }
                        }}
                        value={specificDate || ""}
                      />
                   </div>
                </div>
              </div>
              
              <div className={`relative transition-opacity duration-200 ${specificDate ? 'opacity-50 pointer-events-none' : ''}`}>
                <select
                  className="w-full bg-[#0f172a] border-none rounded-lg py-3 px-4 text-gray-200 appearance-none cursor-pointer hover:bg-[#1e293b] transition-colors focus:ring-1 focus:ring-white/10 outline-none text-sm"
                  value={year === null ? "" : year}
                  onChange={(e) => {
                    const next = e.target.value === "" ? null : Number(e.target.value);
                    setYear(next);
                  }}
                >
                  <option value="" className="bg-[#0f172a] text-gray-400">{t("all_years", { default: "All years" })}</option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#0f172a] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Month Section */}
            <div className={`space-y-3 transition-opacity duration-200 ${specificDate ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="text-white font-semibold text-lg">{t("filter_month", {default: "Month"})}</div>
               <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setYear(null); // 월 클릭 시 모든 년도 표시
                      setMonth(null);
                    }}
                    className={`
                      col-span-1 rounded-lg border transition-all duration-200 p-3 flex flex-col items-center justify-center aspect-[4/3.2]
                      ${month === null
                        ? "bg-[#453434] border-orange-500/30 text-orange-200"
                        : "bg-[#0f172a] border-transparent text-gray-400 hover:bg-[#1e293b]"
                      }
                    `}
                  >
                     <span className="text-sm font-medium text-center leading-tight">
                       {t("all_months_short", {default: "All\nmonths"}).split('\n').map((line, i) => (
                         <span key={i} className="block">{line}</span>
                       ))}
                     </span>
                  </button>

                  {monthLabels.map((label, index) => (
                     <button
                       key={label}
                       onClick={() => {
                         setYear(null); // 월 클릭 시 모든 년도 표시
                         setMonth(index);
                       }}
                       className={`
                         relative flex flex-col justify-between p-3 rounded-lg border transition-all duration-200 aspect-[4/3.2] group
                         ${month === index
                           ? "bg-[#453434] border-orange-500/30 text-orange-200"
                           : "bg-[#0f172a] border-transparent text-gray-400 hover:bg-[#1e293b]"
                         }
                       `}
                     >
                        <span className="text-sm font-medium self-start">{label}</span>
                        <span className={`text-xs self-end font-mono transition-opacity ${month === index ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}`}>
                          {monthCounts[index] || 0}
                        </span>
                     </button>
                  ))}
               </div>
            </div>

            {specificDate && (
               <div className="pt-4 border-t border-white/10 text-center animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-orange-200/70 mb-1 font-medium">Filtered by Date</p>
                  <p className="text-sm font-bold text-orange-400 bg-orange-500/10 py-1 px-3 rounded-full inline-block border border-orange-500/20">
                     {formatDate(specificDate, locale)}
                  </p>
               </div>
            )}
          </div>
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
              {filtered.map((diary, index) => (
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
                        priority={index < 2}
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
