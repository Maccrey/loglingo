"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NewDiaryPage() {
  const [content, setContent] = useState("");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/diary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Entry</h1>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" className="w-full sm:w-auto" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            className="flex min-h-[300px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all hover:bg-white/10 resize-none"
            placeholder="Write your diary in your target language..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Button variant="ghost" size="sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          
          <div className="flex gap-2">
            <Button variant="secondary">Save Draft</Button>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Check
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
