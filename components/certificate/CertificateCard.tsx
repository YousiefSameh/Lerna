"use client";

import { UserCertificatesType } from "@/app/data/certificate/get-user-certificates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Download } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import Link from "next/link";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface CertificateCardProps {
  certificate: UserCertificatesType;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const thumbnailUrl = useConstructUrl(certificate.course.filekey);

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant="secondary"
          className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
        >
          <Award className="size-3 mr-1" />
          Completed
        </Badge>
      </div>

      <Image
        src={thumbnailUrl}
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
        alt={`${certificate.courseTitle} certificate`}
      />

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition">
            {certificate.courseTitle}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {certificate.courseCategory}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Completed on{" "}
            {formatDate(certificate.completionDate, "MMM dd, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{certificate.courseLevel}</Badge>
          <Badge variant="outline">{certificate.courseDuration} hours</Badge>
        </div>

        <Link
          href={`/dashboard/${certificate.course.slug}/certificate`}
          className="block"
        >
          <Button className="w-full" variant="outline">
            <Download className="size-4 mr-2" />
            View Certificate
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
