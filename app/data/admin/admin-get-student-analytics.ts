import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getStudentAnalytics() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalStudents,
    activeStudents,
    allEnrollments,
    allLessonProgress,
    topPerformers,
  ] = await Promise.all([
    // Total customers (enrolled students)
    prisma.user.count({
      where: {
        enrollment: {
          some: {},
        },
      },
    }),

    // Active students (completed a lesson in last 30 days)
    prisma.user.count({
      where: {
        lessonProgress: {
          some: {
            updatedAt: {
              gte: thirtyDaysAgo,
            },
            completed: true,
          },
        },
      },
    }),

    // All enrollments with course info
    prisma.enrollment.findMany({
      where: {
        status: "Active",
      },
      select: {
        userId: true,
        courseId: true,
        Course: {
          select: {
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

    // All lesson progress
    prisma.lessonProgress.findMany({
      where: {
        completed: true,
      },
      select: {
        userId: true,
        lessonId: true,
      },
    }),

    // Top performers (students with highest exam scores)
    prisma.userExamAttempt.groupBy({
      by: ["userId"],
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _avg: {
          score: "desc",
        },
      },
      take: 5,
    }),
  ]);

  // Calculate average completion rate
  let totalCompletionRate = 0;
  let enrollmentCount = 0;

  allEnrollments.forEach((enrollment) => {
    const totalLessons = enrollment.Course.chapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0
    );
    if (totalLessons === 0) return;

    const completedLessons = allLessonProgress.filter(
      (progress) =>
        progress.userId === enrollment.userId &&
        enrollment.Course.chapters.some((chapter) =>
          chapter.lessons.some((lesson) => lesson.id === progress.lessonId)
        )
    ).length;

    const completionRate = (completedLessons / totalLessons) * 100;
    totalCompletionRate += completionRate;
    enrollmentCount++;
  });

  const averageCompletionRate =
    enrollmentCount > 0 ? Math.round(totalCompletionRate / enrollmentCount) : 0;

  // Get user details for top performers
  const topPerformerDetails = await prisma.user.findMany({
    where: {
      id: {
        in: topPerformers.map((p) => p.userId),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const topPerformersWithDetails = topPerformers.map((performer) => {
    const user = topPerformerDetails.find((u) => u.id === performer.userId);
    return {
      userId: performer.userId,
      name: user?.name || "Unknown",
      email: user?.email || "",
      averageScore: Math.round(performer._avg.score || 0),
      examsTaken: performer._count.id,
    };
  });

  return {
    totalStudents,
    activeStudents,
    averageCompletionRate,
    topPerformers: topPerformersWithDetails,
  };
}

export type StudentAnalyticsType = Awaited<ReturnType<typeof getStudentAnalytics>>;
