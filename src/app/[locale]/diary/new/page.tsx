"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NewDiaryPage() {
  const t = useTranslations('write');
  const tCommon = useTranslations('common');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
      
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-muted-foreground">
              Date
            </label>
            <Input type="date" id="date" className="w-full sm:w-auto" />
          </div>

          <div className="flex flex-col space-y-2">
            <textarea
              className="min-h-[300px] w-full rounded-lg border border-white/10 bg-white/5 p-4 text-base text-foreground placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-sm resize-none"
              placeholder={t('placeholder')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              {t('upload_image')}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost">{tCommon('cancel')}</Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('ai_check')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
