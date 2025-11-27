import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function DiaryListPage() {
  const t = useTranslations('diary');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <Link href="/diary/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('new_entry')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for empty state */}
        <Card className="col-span-full flex min-h-[200px] flex-col items-center justify-center border-dashed bg-transparent text-center">
          <p className="text-muted-foreground">{t('empty')}</p>
        </Card>
      </div>
    </div>
  );
}
