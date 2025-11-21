import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getExamAnalytics() {
  await requireAdmin();

  const [totalExams, totalAttempts, allAttempts] = await Promise.all([
    // Total exams
    prisma.exam.count(),
    
    // Total attempts
    prisma.userExamAttempt.count(),
    
    // All attempts with exam info for calculations
    prisma.userExamAttempt.findMany({
      select: {
        passed: true,
        score: true,
        exam: {
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);

  // Calculate overall pass rate
  const passedAttempts = allAttempts.filter((attempt) => attempt.passed).length;
  const overallPassRate = totalAttempts > 0 
    ? Math.round((passedAttempts / totalAttempts) * 100) 
    : 0;

  // Calculate average score
  const totalScore = allAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const averageScore = totalAttempts > 0 
    ? Math.round(totalScore / totalAttempts) 
    : 0;

  // Find most challenging exams (group by exam, calculate pass rate)
  const examStats = new Map<string, { title: string; lessonTitle: string; attempts: number; passed: number }>();
  
  allAttempts.forEach((attempt) => {
    const examId = attempt.exam.id;
    if (!examStats.has(examId)) {
      examStats.set(examId, {
        title: attempt.exam.title,
        lessonTitle: attempt.exam.lesson.title,
        attempts: 0,
        passed: 0,
      });
    }
    const stats = examStats.get(examId)!;
    stats.attempts++;
    if (attempt.passed) stats.passed++;
  });

  const challengingExams = Array.from(examStats.entries())
    .map(([id, stats]) => ({
      id,
      title: stats.title,
      lessonTitle: stats.lessonTitle,
      attempts: stats.attempts,
      passRate: stats.attempts > 0 ? Math.round((stats.passed / stats.attempts) * 100) : 0,
    }))
    .sort((a, b) => a.passRate - b.passRate)
    .slice(0, 5);

  return {
    totalExams,
    totalAttempts,
    overallPassRate,
    averageScore,
    challengingExams,
  };
}

export type ExamAnalyticsType = Awaited<ReturnType<typeof getExamAnalytics>>;
