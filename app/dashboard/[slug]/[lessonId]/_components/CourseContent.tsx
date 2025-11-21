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

import { ExamRunner } from "@/components/exam/ExamRunner";
import { useState } from "react";

interface CourseContentProps {
  lesson: GetLessonContentType;
}

export function CourseContent({ lesson }: CourseContentProps) {
  const [pending, startTransition] = useTransition();
  const [showExam, setShowExam] = useState(false);
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

  const isCompleted = lesson.lessonProgress.length > 0 && lesson.lessonProgress[0].completed;
  const hasExam = !!lesson.exam;
  
  // Check if student has taken the exam before
  const examAttempts = lesson.exam?.attempts || [];
  const hasAttemptedExam = examAttempts.length > 0;
  const bestAttempt = hasAttemptedExam 
    ? examAttempts.reduce((best, current) => current.score > best.score ? current : best)
    : null;
  const attemptsRemaining = 3 - examAttempts.length;

  if (showExam && lesson.exam) {
    return (
      <div className="flex flex-col h-full bg-background pl-6 py-6">
        <Button variant="ghost" onClick={() => setShowExam(false)} className="mb-4 w-fit">
          &larr; Back to Lesson
        </Button>
        <ExamRunner 
          examId={lesson.exam.id} 
          questions={lesson.exam.questions.map(q => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options,
            position: q.position
          }))}
          initialAttemptsUsed={lesson.exam.attempts.length}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={lesson.thumbnailKey || ""}
        videoKey={lesson.videoKey || ""}
      />
      <div className="py-3 border-b flex justify-between items-center">
        {isCompleted ? (
          <div className="flex gap-2 items-center flex-wrap">
            <Button variant={"outline"} className="bg-green-500/10 text-green-500 hover:text-green-600 cursor-default">
              <CheckCircle className="size-4 mr-2 text-green-500" />
              Completed
            </Button>
            {hasExam && hasAttemptedExam && bestAttempt && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">Best Score:</span>
                  <span className={`text-sm font-bold ${bestAttempt.passed ? 'text-green-500' : 'text-orange-500'}`}>
                    {bestAttempt.score}%
                  </span>
                </div>
                {attemptsRemaining > 0 && (
                  <Button onClick={() => setShowExam(true)} variant="outline">
                    Retry Exam ({attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} left)
                  </Button>
                )}
              </>
            )}
            {hasExam && !hasAttemptedExam && (
              <Button onClick={() => setShowExam(true)}>
                Take Exam
              </Button>
            )}
          </div>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
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
