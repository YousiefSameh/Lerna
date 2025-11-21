import { getCertificateByCourseSlug } from "@/app/data/certificate/get-certificate";
import { CertificateTemplate } from "@/components/certificate/CertificateTemplate";
import { CertificateActions } from "./_components/CertificateActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { slug } = await params;
  const certificate = await getCertificateByCourseSlug(slug);

  if (!certificate) {
    redirect(`/dashboard/${slug}`);
  }

  return (
    <div className="h-full bg-background pl-6 pr-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/${slug}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to Course
          </Button>
        </Link>
        <CertificateActions 
          certificateId={certificate.certificateId}
          studentName={certificate.studentName}
          courseTitle={certificate.courseTitle}
        />
      </div>

      {/* Certificate */}
      <CertificateTemplate certificate={certificate} />

      {/* Info */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          This certificate verifies that you have successfully completed all course requirements.
        </p>
        <p>
          You can download this certificate as a PDF for your records.
        </p>
      </div>
    </div>
  );
}
