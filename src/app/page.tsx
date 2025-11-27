import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
          Master Languages with Your Daily Diary
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Write freely, get AI-powered corrections, and learn from your own life.
          Loglingo turns your daily moments into language lessons.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/diary/new">
          <Button size="lg" className="w-full sm:w-auto group">
            Start Writing
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link href="/diary">
          <Button variant="glass" size="lg" className="w-full sm:w-auto">
            View Diary
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
        <div className="glass-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-xl">1</div>
          <h3 className="font-semibold text-lg mb-2">Write Daily</h3>
          <p className="text-sm text-muted-foreground">Keep a journal in your target language. Attach photos to make it memorable.</p>
        </div>
        <div className="glass-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center mb-4 text-accent font-bold text-xl">2</div>
          <h3 className="font-semibold text-lg mb-2">Get Corrected</h3>
          <p className="text-sm text-muted-foreground">AI analyzes your grammar and suggests natural expressions instantly.</p>
        </div>
        <div className="glass-card p-6 text-left">
          <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-500 font-bold text-xl">3</div>
          <h3 className="font-semibold text-lg mb-2">Learn & Quiz</h3>
          <p className="text-sm text-muted-foreground">Review your mistakes with auto-generated quizzes based on your diary.</p>
        </div>
      </div>
    </div>
  );
}
