import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { checkCertificateEligibility } from "@/app/data/certificate/check-certificate-eligibility";
import { CourseSidebar } from "../_components/CourseSidebar";

interface CourseLayoutProps {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export default async function CourseLayout({ params, children }: CourseLayoutProps) {
  const { slug } = await params;
  const [course, certificateEligibility] = await Promise.all([
    getCourseSidebarData(slug),
    checkCertificateEligibility(slug),
  ]);

  return (
    <div className="flex flex-1">
      {/* sidebar => 30% */}
      <CourseSidebar 
        course={course.course}
        certificateEligibility={certificateEligibility}
      />
      {/* Main content => 70% */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}