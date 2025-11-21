"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      },
    });

    return {
      status: "success",
      message: "Lesson Updated Successfully"
    }
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

import { examSchema, ExamSchemaType } from "@/lib/zodSchemas";

export async function createExam(values: ExamSchemaType): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = examSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    await prisma.exam.create({
      data: {
        title: result.data.title,
        lessonId: result.data.lessonId,
        questions: {
          create: result.data.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options,
            answer: q.answer,
            position: q.position,
          })),
        },
      },
    });

    return { status: "success", message: "Exam Created Successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create exam" };
  }
}

export async function updateExam(values: ExamSchemaType, examId: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = examSchema.safeParse(values);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.exam.update({
        where: { id: examId },
        data: { title: result.data.title },
      });

      await tx.question.deleteMany({ where: { examId } });
      
      await tx.question.createMany({
        data: result.data.questions.map((q) => ({
          examId,
          text: q.text,
          type: q.type,
          options: q.options,
          answer: q.answer,
          position: q.position,
        })),
      });
    });

    return { status: "success", message: "Exam Updated Successfully" };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to update exam" };
  }
}

export async function deleteExam(examId: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.exam.delete({ where: { id: examId } });
    return { status: "success", message: "Exam Deleted Successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete exam" };
  }
}
