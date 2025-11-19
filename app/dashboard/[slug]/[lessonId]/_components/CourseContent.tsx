"use client";

import { GetLessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { tryCatch } from "@/lib/try-catch";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { markLessonComplete } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface CourseContentProps {
  lesson: GetLessonContentType;
}

export function CourseContent({ lesson }: CourseContentProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  const VideoPlayer = ({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) => {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a a video yet!
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          className="size-full object-cover"
          controls
          poster={thumbnailUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const onSubmit = () => {
    startTransition(async () => {
      const courseSlug = lesson.Chapter.Course?.slug;
      if (!courseSlug) {
        toast.error("Slug not found");
        return;
      }
      const { data, error } = await tryCatch(
        markLessonComplete(lesson.id, courseSlug)
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        triggerConfetti();
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey || ""}
        videoKey={lesson.videoKey || ""}
      />
      <div className="py-3 border-b">
        {lesson.lessonProgress.length < 0 ? (
          <Button variant={"outline"} className="bg-green-500/10 text-green-500 hover:text-green-600">
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Compelete
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Compelete
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-light text-foreground">
          {lesson.title}
        </h1>
        {lesson.description && (
          <RenderDescription json={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
}
