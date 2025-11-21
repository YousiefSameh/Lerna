import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseSlugRouteProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({
  params,
}: CourseSlugRouteProps) {
  return (
    <Suspense fallback={<CourseLoadingSkeleton />}>
      <CourseRedirect params={params} />
    </Suspense>
  );
}

async function CourseRedirect({ params }: CourseSlugRouteProps) {
  const { slug } = await params;
  const { course } = await getCourseSidebarData(slug);

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  
  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
      <p className="text-muted-foreground">This course does not have any lessons yet!</p>
    </div>
  );
}

function CourseLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background pl-6 pr-6 py-8 space-y-6">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
