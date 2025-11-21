import { getStudentDashboardStats } from "../data/student/get-student-dashboard-stats";
import { getStudentExamStats } from "../data/student/get-student-exam-stats";
import { getStudentCourseProgress } from "../data/student/get-student-course-progress";
import { getAllCourses } from "../data/course/get-all-courses";
import { requrieUser } from "../data/user/require-user";
import { ProgressOverviewCard } from "@/components/student/ProgressOverviewCard";
import { ExamPerformanceCard } from "@/components/student/ExamPerformanceCard";
import { CourseProgressList } from "@/components/student/CourseProgressList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Trophy, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/general/EmptyState";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";

export default async function DashboardPage() {
  const user = await requrieUser();
  
  const [dashboardStats, examStats, courseProgress, allCourses] = await Promise.all([
    getStudentDashboardStats(),
    getStudentExamStats(),
    getStudentCourseProgress(),
    getAllCourses(),
  ]);

  const hasEnrolledCourses = courseProgress.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 rounded-lg border-2 border-primary/20">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          {hasEnrolledCourses 
            ? "Ready to continue your learning journey?" 
            : "Let's get started with your first course!"}
        </p>
      </div>

      {hasEnrolledCourses ? (
        <>
          {/* Progress Overview */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
            <ProgressOverviewCard data={dashboardStats} />
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-auto p-1">
              <TabsTrigger value="courses" className="flex items-center gap-2 py-3">
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">My Courses</span>
                <span className="sm:hidden">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="exams" className="flex items-center gap-2 py-3">
                <Trophy className="size-4" />
                <span className="hidden sm:inline">Exam Performance</span>
                <span className="sm:hidden">Exams</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Continue Learning</h3>
                <p className="text-sm text-muted-foreground">
                  {courseProgress.filter(c => !c.isCompleted).length} in progress
                </p>
              </div>
              <CourseProgressList courses={courseProgress} />
            </TabsContent>

            <TabsContent value="exams" className="space-y-4">
              <ExamPerformanceCard data={examStats} />
            </TabsContent>
          </Tabs>

          {/* Available Courses Section */}
          {allCourses.filter(
            (course) => !courseProgress.some((enrolled) => enrolled.courseId === course.id)
          ).length > 0 && (
            <section className="pt-8 border-t">
              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-2xl font-bold">Discover More Courses</h2>
                <p className="text-muted-foreground">
                  Explore new topics and expand your knowledge
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allCourses
                  .filter(
                    (course) =>
                      !courseProgress.some((enrolled) => enrolled.courseId === course.id)
                  )
                  .slice(0, 4)
                  .map((course) => (
                    <PublicCourseCard key={course.id} data={course} />
                  ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <EmptyState
          title="No Courses Purchased"
          description="You have not purchased any courses yet!"
          buttonText="Browse Courses"
          href="/courses"
        />
      )}
    </div>
  );
}
