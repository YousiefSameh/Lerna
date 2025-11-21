import { StudentExamStatsType } from "@/app/data/student/get-student-exam-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date-utils";

interface ExamPerformanceCardProps {
  data: StudentExamStatsType;
}

export function ExamPerformanceCard({ data }: ExamPerformanceCardProps) {
  const { totalAttempts, examsTakenCount, averageScore, passRate, recentAttempts } = data;

  if (totalAttempts === 0) {
    return (
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Exam Performance
          </CardTitle>
          <CardDescription>Your exam statistics will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="size-12 mx-auto mb-2 opacity-50" />
            <p>No exams taken yet. Complete lessons to unlock exams!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-purple-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Exams Taken</CardDescription>
            <CardTitle className="text-3xl font-bold">{examsTakenCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unique assessments</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalAttempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All submissions</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${averageScore >= 70 ? 'border-green-500/20 bg-green-50 dark:bg-green-950/10' : 'border-orange-500/10'}`}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Average Score
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{averageScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${passRate >= 70 ? 'border-green-500/20 bg-green-50 dark:bg-green-950/10' : 'border-red-500/20'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Pass Rate</CardDescription>
            <CardTitle className="text-3xl font-bold">{passRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attempts */}
      {recentAttempts.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Recent Exam Attempts
            </CardTitle>
            <CardDescription>Your latest exam submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className={`p-4 rounded-lg border-2 ${
                    attempt.passed
                      ? 'border-green-500/20 bg-green-50 dark:bg-green-950/10'
                      : 'border-red-500/20 bg-red-50 dark:bg-red-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {attempt.passed ? (
                          <CheckCircle2 className="size-5 text-green-500" />
                        ) : (
                          <XCircle className="size-5 text-red-500" />
                        )}
                        <h4 className="font-semibold">{attempt.examTitle}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{attempt.lessonTitle}</p>
                      <p className="text-xs text-muted-foreground">{attempt.courseTitle}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={attempt.passed ? "default" : "destructive"}
                        className={attempt.passed ? "bg-green-500" : ""}
                      >
                        {attempt.score}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(attempt.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
