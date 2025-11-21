import { Suspense } from "react";
import Link from "next/link";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { getEnrollmentsStats } from "../data/admin/admin-get-enrollments-stats";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./courses/_components/AdminCourseCard";
import { getExamAnalytics } from "../data/admin/admin-get-exam-analytics";
import { getStudentAnalytics } from "../data/admin/admin-get-student-analytics";
import { getRevenueAnalytics } from "../data/admin/admin-get-revenue-analytics";
import { ExamAnalyticsCard } from "@/components/admin/ExamAnalyticsCard";
import { StudentPerformanceTable } from "@/components/admin/StudentPerformanceTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, DollarSign, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function AdminIndexPage() {
  const [enrollmentData, examAnalytics, studentAnalytics, revenueAnalytics] = await Promise.all([
    getEnrollmentsStats(),
    getExamAnalytics(),
    getStudentAnalytics(),
    getRevenueAnalytics(),
  ]);

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <SectionCards />
      </div>

      {/* Enrollment Chart */}
      <Card className="border-2 border-primary/10">
        <ChartAreaInteractive enrollmentData={enrollmentData} />
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="exams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="exams" className="flex items-center gap-2 py-3">
            <GraduationCap className="size-4" />
            <span className="hidden sm:inline">Exam Analytics</span>
            <span className="sm:hidden">Exams</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2 py-3">
            <Users className="size-4" />
            <span className="hidden sm:inline">Student Performance</span>
            <span className="sm:hidden">Students</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2 py-3">
            <DollarSign className="size-4" />
            <span className="hidden sm:inline">Revenue Insights</span>
            <span className="sm:hidden">Revenue</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-4">
          <ExamAnalyticsCard data={examAnalytics} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentPerformanceTable data={studentAnalytics} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart data={revenueAnalytics} />
        </TabsContent>
      </Tabs>

      {/* Recent Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();
  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create New Course"
        description="you do not have any courses. create some to see them here"
        title="You do not have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
