import "server-only";

import { prisma } from "@/lib/db";
import { requrieUser } from "@/app/data/user/require-user";

export async function getStudentCourseProgress() {
  const user = await requrieUser();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      Course: {
        select: {
          id: true,
          title: true,
          slug: true,
          filekey: true,
          chapters: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              lessons: {
                orderBy: {
                  position: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  position: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
    },
    select: {
      lessonId: true,
    },
  });

  const completedLessonIds = new Set(lessonProgress.map((p) => p.lessonId));

  const coursesWithProgress = enrollments.map((enrollment) => {
    const course = enrollment.Course;
    
    // Get all lessons
    const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);
    const totalLessons = allLessons.length;
    
    // Count completed lessons
    const completedLessons = allLessons.filter((lesson) =>
      completedLessonIds.has(lesson.id)
    ).length;

    // Calculate progress percentage
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find next lesson (first incomplete lesson)
    let nextLesson = null;
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessonIds.has(lesson.id)) {
          nextLesson = {
            id: lesson.id,
            title: lesson.title,
            chapterTitle: chapter.title,
          };
          break;
        }
      }
      if (nextLesson) break;
    }

    return {
      courseId: course.id,
      courseTitle: course.title,
      courseSlug: course.slug,
      thumbnailKey: course.filekey,
      totalLessons,
      completedLessons,
      progressPercentage,
      nextLesson,
      isCompleted: completedLessons === totalLessons && totalLessons > 0,
    };
  });

  // Sort by progress (in progress first, then by percentage)
  coursesWithProgress.sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return b.progressPercentage - a.progressPercentage;
  });

  return coursesWithProgress;
}

export type StudentCourseProgressType = Awaited<ReturnType<typeof getStudentCourseProgress>>;
