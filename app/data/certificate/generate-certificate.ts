"use server";

import { requrieUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

interface GenerateCertificateParams {
  courseId: string;
  courseSlug: string;
}

export async function generateCertificate({
  courseId,
  courseSlug,
}: GenerateCertificateParams): Promise<ApiResponse> {
  const user = await requrieUser();

  try {
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment || enrollment.status !== "Active") {
      return {
        status: "error",
        message: "You are not enrolled in this course",
      };
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existingCertificate) {
      return {
        status: "success",
        message: "Certificate already exists",
      };
    }

    // Get course details with all lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                lessonProgress: {
                  where: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // Calculate progress to verify 100% completion
    let totalLessons = 0;
    let completedLessons = 0;

    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;
        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.completed
        );
        if (isCompleted) {
          completedLessons++;
        }
      });
    });

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    if (progressPercentage !== 100) {
      return {
        status: "error",
        message: "You must complete all lessons to receive a certificate",
      };
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${Date.now()}-${user.id.slice(0, 8).toUpperCase()}`;

    // Create certificate
    await prisma.certificate.create({
      data: {
        certificateId,
        userId: user.id,
        courseId,
        courseTitle: course.title,
        studentName: user.name,
        instructorName: course.user?.name || "Lerna Team",
        courseDuration: course.duration,
        courseLevel: course.level,
        courseCategory: course.category,
      },
    });

    revalidatePath(`/dashboard/${courseSlug}`);
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Certificate generated successfully!",
    };
  } catch (error) {
    console.error("Error generating certificate:", error);
    return {
      status: "error",
      message: "Failed to generate certificate",
    };
  }
}
