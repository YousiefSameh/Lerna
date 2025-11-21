import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getRevenueAnalytics() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [allEnrollments, recentEnrollments, courseRevenue] = await Promise.all([
    // All active enrollments
    prisma.enrollment.findMany({
      where: {
        status: "Active",
      },
      select: {
        amount: true,
        createdAt: true,
      },
    }),

    // Recent enrollments (last 30 days)
    prisma.enrollment.findMany({
      where: {
        status: "Active",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    }),

    // Revenue by course
    prisma.enrollment.groupBy({
      by: ["courseId"],
      where: {
        status: "Active",
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  // Calculate total revenue
  const totalRevenue = allEnrollments.reduce((sum, e) => sum + e.amount, 0);

  // Calculate recent revenue
  const recentRevenue = recentEnrollments.reduce((sum, e) => sum + e.amount, 0);

  // Calculate revenue trend (last 30 days)
  const revenueTrend: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    revenueTrend.push({ date: dateString, revenue: 0 });
  }

  recentEnrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const dayIndex = revenueTrend.findIndex((day) => day.date === enrollmentDate);

    if (dayIndex !== -1) {
      revenueTrend[dayIndex].revenue += enrollment.amount;
    }
  });

  // Get top earning courses
  const topCourseIds = courseRevenue
    .sort((a, b) => (b._sum.amount || 0) - (a._sum.amount || 0))
    .slice(0, 5)
    .map((c) => c.courseId);

  const topCoursesDetails = await prisma.course.findMany({
    where: {
      id: {
        in: topCourseIds,
      },
    },
    select: {
      id: true,
      title: true,
      price: true,
    },
  });

  const topEarningCourses = courseRevenue
    .filter((c) => topCourseIds.includes(c.courseId))
    .map((c) => {
      const course = topCoursesDetails.find((cd) => cd.id === c.courseId);
      return {
        courseId: c.courseId,
        title: course?.title || "Unknown",
        price: course?.price || 0,
        totalRevenue: c._sum.amount || 0,
        enrollments: c._count.id,
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Average revenue per enrollment
  const averageRevenuePerEnrollment =
    allEnrollments.length > 0
      ? Math.round(totalRevenue / allEnrollments.length)
      : 0;

  return {
    totalRevenue,
    recentRevenue,
    revenueTrend,
    topEarningCourses,
    averageRevenuePerEnrollment,
    totalEnrollments: allEnrollments.length,
  };
}

export type RevenueAnalyticsType = Awaited<ReturnType<typeof getRevenueAnalytics>>;
