import { RevenueAnalyticsType } from "@/app/data/admin/admin-get-revenue-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RevenueChartProps {
  data: RevenueAnalyticsType;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { 
    totalRevenue, 
    recentRevenue, 
    topEarningCourses, 
    averageRevenuePerEnrollment,
    totalEnrollments 
  } = data;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in cents
  };

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-background dark:from-green-950/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="size-4" />
              Total Revenue
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Last 30 Days
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(recentRevenue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Recent earnings</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/10">
          <CardHeader className="pb-2">
            <CardDescription>Avg per Enrollment</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(averageRevenuePerEnrollment)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Average order value</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShoppingCart className="size-4" />
              Total Enrollments
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {totalEnrollments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Earning Courses */}
      {topEarningCourses.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Top Earning Courses</CardTitle>
            <CardDescription>Courses generating the most revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Enrollments</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topEarningCourses.map((course, index) => (
                  <TableRow key={course.courseId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center justify-center size-8 rounded font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="font-medium">{course.title}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(course.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {course.enrollments}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(course.totalRevenue)}
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
