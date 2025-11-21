import "server-only";

import { prisma } from "@/lib/db";
import { requrieUser } from "@/app/data/user/require-user";

export async function getStudentExamStats() {
  const user = await requrieUser();

  const examAttempts = await prisma.userExamAttempt.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      score: true,
      passed: true,
      createdAt: true,
      exam: {
        select: {
          id: true,
          title: true,
          lesson: {
            select: {
              title: true,
              Chapter: {
                select: {
                  Course: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalAttempts = examAttempts.length;
  const passedAttempts = examAttempts.filter((a) => a.passed).length;
  
  const averageScore =
    totalAttempts > 0
      ? Math.round(
          examAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts
        )
      : 0;

  const passRate =
    totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  // Get recent attempts (last 5)
  const recentAttempts = examAttempts.slice(0, 5).map((attempt) => ({
    id: attempt.id,
    examTitle: attempt.exam.title,
    lessonTitle: attempt.exam.lesson.title,
    courseTitle: attempt.exam.lesson.Chapter.Course?.title || "Unknown",
    score: attempt.score,
    passed: attempt.passed,
    date: attempt.createdAt,
  }));

  // Get unique exams taken
  const uniqueExams = new Set(examAttempts.map((a) => a.exam.id));
  const examsTakenCount = uniqueExams.size;

  return {
    totalAttempts,
    examsTakenCount,
    averageScore,
    passRate,
    recentAttempts,
  };
}

export type StudentExamStatsType = Awaited<ReturnType<typeof getStudentExamStats>>;
