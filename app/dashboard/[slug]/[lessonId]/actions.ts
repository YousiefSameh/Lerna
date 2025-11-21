"use server";

import { requrieUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const session = await requrieUser();

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: session.id,
        lessonId,
        completed: true,
      },
    });
    revalidatePath(`/dashboard/${slug}/`);
    return {
      status: "success",
      message: "Progress Updated",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to mark lesson as completed",
    };
  }
}

export async function submitExam(examId: string, answers: Record<string, string>) {
  const user = await requrieUser();

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { 
      questions: true,
      lesson: {
        include: {
          Chapter: {
            include: {
              Course: true
            }
          }
        }
      }
    },
  });

  if (!exam) {
    return {
      status: "error",
      message: "Exam not found",
    };
  }

  // Check attempts
  const attemptsCount = await prisma.userExamAttempt.count({
    where: {
      userId: user.id,
      examId: examId,
    },
  });

  if (attemptsCount >= 3) {
    return {
      status: "error",
      message: "You have used all your attempts",
    };
  }

  // Calculate score
  let correctCount = 0;
  exam.questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return;
    
    // For Multiple Choice, compare index
    if (question.type === "MULTIPLE_CHOICE") {
      if (userAnswer === question.answer) {
        correctCount++;
      }
    } else {
      // For TF and FIB, compare text case-insensitively
      if (userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()) {
        correctCount++;
      }
    }
  });

  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= 50; // 50% passing score

  await prisma.userExamAttempt.create({
    data: {
      userId: user.id,
      examId: examId,
      score,
      passed,
    },
  });

  const courseSlug = exam.lesson.Chapter.Course?.slug;
  if (courseSlug) {
    revalidatePath(`/dashboard/${courseSlug}/${exam.lessonId}`);
  }

  return {
    status: "success",
    data: {
      score,
      passed,
      attemptsUsed: attemptsCount + 1,
      maxAttempts: 3,
    },
  };
}
