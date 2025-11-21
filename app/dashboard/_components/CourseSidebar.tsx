"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { CertificateEligibilityType } from "@/app/data/certificate/check-certificate-eligibility";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { CertificateButton } from "@/components/certificate/CertificateButton";

interface CourseSidebarProps {
  course: CourseSidebarDataType["course"];
  certificateEligibility: CertificateEligibilityType;
}

export function CourseSidebar({ course, certificateEligibility }: CourseSidebarProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  const [isOpen, setIsOpen] = useState(true);

  const { completedLessons, progressPercentage, totalLessons } =
    useCourseProgress({ courseData: course });

  return (
    <div 
      className={cn(
        "flex flex-col h-full border-r border-border bg-background transition-all duration-300 relative shrink-0",
        isOpen ? "w-80" : "w-[60px]"
      )}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
      >
        {isOpen ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
      </Button>

      <div className={cn("flex flex-col h-full overflow-hidden", !isOpen && "items-center")}>
        <div className={cn("pb-4 border-b border-border", isOpen ? "pr-4" : "px-2")}>
          <div className={cn("flex items-center gap-3 mb-3", !isOpen && "justify-center mb-0 mt-4")}>
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Play className="size-5 text-primary" />
            </div>

            {isOpen && (
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-base leading-tight truncate">
                  {course.title}
                </h1>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {course.category}
                </p>
              </div>
            )}
          </div>
          
          {isOpen && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {completedLessons}/{totalLessons} lessons
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {progressPercentage}% completed
                </p>
              </div>
              
              {/* Certificate Button */}
              <div className="mt-4">
                <CertificateButton
                  courseId={certificateEligibility.courseId}
                  courseSlug={course.slug}
                  isEligible={certificateEligibility.isEligible}
                  hasCertificate={certificateEligibility.hasCertificate}
                  progressPercentage={certificateEligibility.progressPercentage}
                />
              </div>
            </>
          )}
        </div>

        <div className={cn("py-4 space-y-3 overflow-y-auto", isOpen ? "pr-4" : "px-2 no-scrollbar")}>
          {course.chapters.map((chapter, index) => (
            isOpen ? (
              <Collapsible key={chapter.id} defaultOpen={index === 0}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full p-3 h-auto flex items-center gap-2"
                  >
                    <div className="shrink-0">
                      <ChevronDown className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">
                        {chapter.position}: {chapter.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">
                        {chapter.lessons.length} Lessons
                      </p>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                  {chapter.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      slug={course.slug}
                      isActive={currentLessonId === lesson.id}
                      completed={
                        lesson.lessonProgress.find(
                          (progress) => progress.lessonId === lesson.id
                        )?.completed || false
                      }
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              // Collapsed state: maybe show chapter number or simple dot?
              // For now, let's just hide the list or show a tooltip. 
              // Given the complexity of showing lessons in collapsed state, I'll just hide them or show minimal indicators.
              // Let's show a simple indicator for each chapter.
              <div key={chapter.id} className="flex justify-center" title={chapter.title}>
                 <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {chapter.position}
                 </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
