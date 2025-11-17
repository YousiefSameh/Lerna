"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { enrollmentCourseAction } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollmentCourseAction(courseId));

      if (error) {
        toast.error("An unexpected error occured. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };
  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <span>Enroll Now</span>
      )}
    </Button>
  );
}
