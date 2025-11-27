import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";

export default function DiaryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Diary</h1>
          <p className="text-muted-foreground">Your language learning journey</p>
        </div>
        <Link href="/diary/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder items */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:bg-white/10 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Oct {20 + i}, 2023</span>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Today I learned about...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Corrected</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
