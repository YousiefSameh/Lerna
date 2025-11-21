import { ExamAnalyticsType } from "@/app/data/admin/admin-get-exam-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ExamAnalyticsCardProps {
  data: ExamAnalyticsType;
}

export function ExamAnalyticsCard({ data }: ExamAnalyticsCardProps) {
  const { totalExams, totalAttempts, overallPassRate, averageScore, challengingExams } = data;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Exams</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalExams}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalAttempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All exam submissions</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${overallPassRate >= 70 ? 'border-green-500/20 bg-green-50 dark:bg-green-950/10' : 'border-red-500/20 bg-red-50 dark:bg-red-950/10'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Overall Pass Rate</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              {overallPassRate}%
              {overallPassRate >= 70 ? (
                <TrendingUp className="size-6 text-green-500" />
              ) : (
                <TrendingDown className="size-6 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallPassRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl font-bold">{averageScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenging Exams */}
      {challengingExams.length > 0 && (
        <Card className="border-2 border-orange-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-500" />
              <CardTitle>Most Challenging Exams</CardTitle>
            </div>
            <CardDescription>Exams with the lowest pass rates - may need review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challengingExams.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{exam.title}</h4>
                      <p className="text-sm text-muted-foreground">{exam.lessonTitle}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${exam.passRate < 50 ? 'text-red-500' : 'text-orange-500'}`}>
                        {exam.passRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">{exam.attempts} attempts</p>
                    </div>
                  </div>
                  <Progress value={exam.passRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
