import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs"; // Need to implement Tabs or use placeholder

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Learning Archive</h1>
        <p className="text-muted-foreground">Review your mistakes and learn new patterns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grammar Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No patterns saved yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No words saved yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
