import "server-only";
import { requrieUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export async function getCertificateByCourseSlug(courseSlug: string) {
  const user = await requrieUser();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true },
  });

  if (!course) {
    return null;
  }

  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    select: {
      id: true,
      certificateId: true,
      completionDate: true,
      courseTitle: true,
      studentName: true,
      instructorName: true,
      courseDuration: true,
      courseLevel: true,
      courseCategory: true,
      createdAt: true,
    },
  });

  return certificate;
}

export type CertificateType = Awaited<ReturnType<typeof getCertificateByCourseSlug>>;
