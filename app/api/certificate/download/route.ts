import { NextRequest, NextResponse } from "next/server";
import { requrieUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { renderCertificateToHtml } from "@/lib/certificate-renderer";
import { getBrowser } from "@/lib/browser";

export async function GET(request: NextRequest) {
  try {
    const user = await requrieUser();
    const searchParams = request.nextUrl.searchParams;
    const certificateId = searchParams.get("certificateId");
    const format = searchParams.get("format") || "pdf";

    if (!certificateId) {
      return new NextResponse("Certificate ID is required", { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: {
        certificateId: certificateId,
      },
    });

    if (!certificate) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Security check: Ensure the user owns the certificate
    if (certificate.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const html = await renderCertificateToHtml(certificate);
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    const safeStudentName = certificate.studentName.replace(/[^a-z0-9]/gi, '_');
    const safeCourseTitle = certificate.courseTitle.replace(/[^a-z0-9]/gi, '_');

    if (format === "png") {
      const screenshot = await page.screenshot({
        type: "png",
        fullPage: true,
        omitBackground: false,
      });
      buffer = Buffer.from(screenshot);
      contentType = "image/png";
      filename = `${safeStudentName}_${safeCourseTitle}_Certificate.png`;
    } else {
      const pdf = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
        margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
      });
      buffer = Buffer.from(pdf);
      contentType = "application/pdf";
      filename = `${safeStudentName}_${safeCourseTitle}_Certificate.pdf`;
    }

    await browser.close();

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
