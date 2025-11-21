import { StudentCourseProgressType } from "@/app/data/student/get-student-course-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { CheckCircle2, PlayCircle, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface CourseProgressListProps {
  courses: StudentCourseProgressType;
}

export function CourseProgressList({ courses }: CourseProgressListProps) {
  if (courses.length === 0) {
    return (
      <Card className="border-2 border-primary/10">
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground">No enrolled courses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <CourseProgressCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}

function CourseProgressCard({ course }: { course: StudentCourseProgressType[0] }) {
  const thumbnailUrl = useConstructUrl(course.thumbnailKey);

  return (
    <Card className="group py-0 relative overflow-hidden border-2 hover:border-primary/30 transition-all">
      {course.isCompleted && (
        <Badge className="absolute top-3 right-3 z-10 bg-green-500">
          <Trophy className="size-3 mr-1" />
          Completed
        </Badge>
      )}
      
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnailUrl}
          width={600}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          alt={`${course.courseTitle} thumbnail`}
        />
        {course.isCompleted && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="size-16 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      <CardContent className="px-4 py-2 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{course.courseTitle}</h3>
          {course.nextLesson && !course.isCompleted && (
            <p className="text-sm text-muted-foreground mt-1">
              Next: {course.nextLesson.title}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{course.progressPercentage}%</span>
          </div>
          <Progress value={course.progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {course.completedLessons} of {course.totalLessons} lessons completed
          </p>
        </div>

        <Link href={`/dashboard/${course.courseSlug}`}>
          <Button className="w-full" variant={course.isCompleted ? "outline" : "default"}>
            {course.isCompleted ? (
              <>
                <CheckCircle2 className="size-4 mr-2" />
                Review Course
              </>
            ) : (
              <>
                <PlayCircle className="size-4 mr-2" />
                Continue Learning
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
