import "server-only";
import { requrieUser } from "../user/require-user";
import { prisma } from "@/lib/db";

interface CertificateEligibility {
  isEligible: boolean;
  hasCertificate: boolean;
  progressPercentage: number;
  courseId: string;
}

export async function checkCertificateEligibility(
  courseSlug: string
): Promise<CertificateEligibility> {
  const user = await requrieUser();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true,
      chapters: {
        select: {
          lessons: {
            select: {
              id: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return {
      isEligible: false,
      hasCertificate: false,
      progressPercentage: 0,
      courseId: "",
    };
  }

  // Calculate progress
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

  // Check if certificate exists
  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  return {
    isEligible: progressPercentage === 100,
    hasCertificate: !!certificate,
    progressPercentage,
    courseId: course.id,
  };
}

export type CertificateEligibilityType = Awaited<
  ReturnType<typeof checkCertificateEligibility>
>;
