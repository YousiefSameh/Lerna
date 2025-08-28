"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/lib/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const [pending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occured. Please try again.");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/admin/courses");
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this </CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-12">
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/courses">Cancel</Link>
          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete Course
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
