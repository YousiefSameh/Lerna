"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileImage, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CertificateActionsProps {
  certificateId: string;
  studentName: string;
  courseTitle: string;
}

export function CertificateActions({
  certificateId,
  studentName,
  courseTitle,
}: CertificateActionsProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleDownload = async (format: 'pdf' | 'png') => {
    const setGenerating = format === 'pdf' ? setIsGeneratingPDF : setIsGeneratingImage;
    setGenerating(true);
    
    try {
      const response = await fetch(`/api/certificate/download?certificateId=${certificateId}&format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}_Certificate.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Certificate ${format.toUpperCase()} downloaded successfully!`);
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      toast.error(`Failed to download certificate ${format.toUpperCase()}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => handleDownload('pdf')} size="sm" disabled={isGeneratingPDF}>
        {isGeneratingPDF ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="size-4 mr-2" />
            Download PDF
          </>
        )}
      </Button>
    </div>
  );
}
