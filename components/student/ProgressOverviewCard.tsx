import { StudentDashboardStatsType } from "@/app/data/student/get-student-dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Flame, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressOverviewCardProps {
  data: StudentDashboardStatsType;
}

export function ProgressOverviewCard({ data }: ProgressOverviewCardProps) {
  const { enrolledCoursesCount, totalLessons, completedLessons, overallCompletionPercentage, learningStreak } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <GraduationCap className="size-4" />
            Enrolled Courses
          </CardDescription>
          <CardTitle className="text-4xl font-bold">{enrolledCoursesCount}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Active enrollments</p>
        </CardContent>
      </Card>

      <Card className={`border-2 ${overallCompletionPercentage >= 70 ? 'border-green-500/20 bg-green-50 dark:bg-green-950/10' : overallCompletionPercentage >= 30 ? 'border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/10' : 'border-red-500/20 bg-red-50 dark:bg-red-950/10'}`}>
        <CardHeader className="pb-2">
          <CardDescription>Overall Progress</CardDescription>
          <CardTitle className="text-4xl font-bold">{overallCompletionPercentage}%</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallCompletionPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">Across all courses</p>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-500/10">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <BookOpen className="size-4" />
            Lessons Progress
          </CardDescription>
          <CardTitle className="text-4xl font-bold flex items-baseline gap-2">
            {completedLessons}
            <span className="text-lg text-muted-foreground font-normal">/ {totalLessons}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Lessons completed</p>
        </CardContent>
      </Card>

      <Card className={`border-2 ${learningStreak > 0 ? 'border-orange-500/20 bg-orange-50 dark:bg-orange-950/10' : 'border-border'}`}>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Flame className={`size-4 ${learningStreak > 0 ? 'text-orange-500' : ''}`} />
            Learning Streak
          </CardDescription>
          <CardTitle className="text-4xl font-bold flex items-center gap-2">
            {learningStreak}
            {learningStreak > 0 && <Flame className="size-8 text-orange-500 animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {learningStreak > 0 ? 'Consecutive days' : 'Start learning today!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
