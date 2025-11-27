import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
// import { Tabs } from "@/components/ui/Tabs"; // Need to implement Tabs or use placeholder
import { useTranslations } from "next-intl";

export default function ArchivePage() {
  const t = useTranslations('archive');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('grammar')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('empty')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('vocabulary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('empty')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
