import "server-only";
import { requrieUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export async function getUserCertificates() {
  const user = await requrieUser();

  const certificates = await prisma.certificate.findMany({
    where: {
      userId: user.id,
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
      course: {
        select: {
          slug: true,
          filekey: true,
        },
      },
    },
    orderBy: {
      completionDate: "desc",
    },
  });

  return certificates;
}

export type UserCertificatesType = Awaited<ReturnType<typeof getUserCertificates>>[0];
