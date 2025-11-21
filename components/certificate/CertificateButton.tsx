"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2 } from "lucide-react";
import { generateCertificate } from "@/app/data/certificate/generate-certificate";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CertificateButtonProps {
  courseId: string;
  courseSlug: string;
  isEligible: boolean;
  hasCertificate: boolean;
  progressPercentage: number;
}

export function CertificateButton({
  courseId,
  courseSlug,
  isEligible,
  hasCertificate,
  progressPercentage,
}: CertificateButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerateCertificate = () => {
    setIsGenerating(true);
    startTransition(async () => {
      const result = await generateCertificate({ courseId, courseSlug });

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/dashboard/${courseSlug}/certificate`);
      } else {
        toast.error(result.message);
      }
      setIsGenerating(false);
    });
  };

  const handleViewCertificate = () => {
    router.push(`/dashboard/${courseSlug}/certificate`);
  };

  if (!isEligible) {
    return (
      <Button variant="outline" disabled className="w-full">
        <Award className="size-4 mr-2" />
        Complete {100 - progressPercentage}% more to earn certificate
      </Button>
    );
  }

  if (hasCertificate) {
    return (
      <Button
        onClick={handleViewCertificate}
        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <Download className="size-4 mr-2" />
        View Certificate
      </Button>
    );
  }

  return (
    <Button
      onClick={handleGenerateCertificate}
      disabled={isPending || isGenerating}
      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
    >
      {isPending || isGenerating ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Award className="size-4 mr-2" />
          Claim Your Certificate
        </>
      )}
    </Button>
  );
}
