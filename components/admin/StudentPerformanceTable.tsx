import { StudentAnalyticsType } from "@/app/data/admin/admin-get-student-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentPerformanceTableProps {
  data: StudentAnalyticsType;
}

export function StudentPerformanceTable({ data }: StudentPerformanceTableProps) {
  const { totalStudents, activeStudents, averageCompletionRate, topPerformers } = data;

  const activePercentage = totalStudents > 0 
    ? Math.round((activeStudents / totalStudents) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="size-4" />
              Total Students
            </CardDescription>
            <CardTitle className="text-3xl font-bold">{totalStudents}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Enrolled customers</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500/20 bg-green-50 dark:bg-green-950/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Active Students
            </CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              {activeStudents}
              <span className="text-base font-normal text-muted-foreground">
                ({activePercentage}%)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active in last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Avg Completion Rate</CardDescription>
            <CardTitle className="text-3xl font-bold">{averageCompletionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Course progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <Card className="border-2 border-yellow-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-yellow-500" />
              <CardTitle>Top Performers</CardTitle>
            </div>
            <CardDescription>Students with highest average exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Avg Score</TableHead>
                  <TableHead className="text-center">Exams Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((student, index) => (
                  <TableRow key={student.userId}>
                    <TableCell className="font-medium">
                      <div className={`flex items-center justify-center size-8 rounded-full ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={student.averageScore >= 90 ? "default" : "secondary"}
                        className={student.averageScore >= 90 ? "bg-green-500" : ""}
                      >
                        {student.averageScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {student.examsTaken}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
