import "server-only";

import { prisma } from "@/lib/db";
import { requrieUser } from "@/app/data/user/require-user";

export async function getStudentDashboardStats() {
  const user = await requrieUser();

  const [enrollments, allLessonProgress] = await Promise.all([
    // Get all enrollments
    prisma.enrollment.findMany({
      where: {
        userId: user.id,
        status: "Active",
      },
      select: {
        Course: {
          select: {
            id: true,
            chapters: {
              select: {
                lessons: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    // Get all lesson progress
    prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
    }),
  ]);

  const enrolledCoursesCount = enrollments.length;

  // Calculate total lessons across all enrolled courses
  let totalLessons = 0;
  enrollments.forEach((enrollment) => {
    enrollment.Course.chapters.forEach((chapter) => {
      totalLessons += chapter.lessons.length;
    });
  });

  const completedLessons = allLessonProgress.length;

  // Calculate overall completion percentage
  const overallCompletionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate learning streak (consecutive days with completed lessons)
  const sortedProgress = allLessonProgress
    .map((p) => p.updatedAt)
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  if (sortedProgress.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = new Date(sortedProgress[0]);
    mostRecent.setHours(0, 0, 0, 0);

    // Check if most recent activity was today or yesterday
    if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
      streak = 1;
      let currentDay = new Date(mostRecent);
      
      for (let i = 1; i < sortedProgress.length; i++) {
        const progressDay = new Date(sortedProgress[i]);
        progressDay.setHours(0, 0, 0, 0);
        
        const expectedDay = new Date(currentDay);
        expectedDay.setDate(expectedDay.getDate() - 1);
        
        if (progressDay.getTime() === expectedDay.getTime()) {
          streak++;
          currentDay = progressDay;
        } else {
          break;
        }
      }
    }
  }

  return {
    enrolledCoursesCount,
    totalLessons,
    completedLessons,
    overallCompletionPercentage,
    learningStreak: streak,
  };
}

export type StudentDashboardStatsType = Awaited<ReturnType<typeof getStudentDashboardStats>>;
