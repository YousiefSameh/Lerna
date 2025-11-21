"use client";

import { CertificateType } from "@/app/data/certificate/get-certificate";
import { Award, Calendar, Clock, GraduationCap, Shield } from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface CertificateTemplateProps {
  certificate: NonNullable<CertificateType>;
}

export function CertificateTemplate({ certificate }: CertificateTemplateProps) {
  return (
    <div>
      <style>{`
        .certificate-container {
          position: relative;
          overflow: hidden;
          padding: 48px;
          min-height: 600px;
          background-color: #ffffff;
          border: 2px solid #e5e7eb;
          color: #111827;
        }

        @media (min-width: 768px) {
          .certificate-container {
            padding: 48px;
          }
        }

        @media print {
          .certificate-container {
            box-shadow: none;
          }
        }

        .cert-content {
          position: relative;
          z-index: 10;
        }

        .cert-section {
          margin-bottom: 32px;
        }

        .cert-header {
          text-align: center;
        }

        .cert-header-spacing {
          margin-bottom: 16px;
        }

        .icon-container {
          display: flex;
          justify-content: center;
        }

        .icon-wrapper {
          padding: 16px;
          border-radius: 9999px;
          background-color: #e6f6f6;
        }

        .icon-large {
          width: 64px;
          height: 64px;
          color: #0ea5a4;
        }

        .title-spacing {
          margin-bottom: 8px;
        }

        .main-title {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 0;
        }

        @media (min-width: 768px) {
          .main-title {
            font-size: 48px;
          }
        }

        .subtitle {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
        }

        .student-section {
          text-align: center;
        }

        .student-section-spacing {
          margin-bottom: 8px;
        }

        .student-name {
          font-size: 30px;
          font-weight: 700;
          color: #0ea5a4;
          margin: 0;
        }

        @media (min-width: 768px) {
          .student-name {
            font-size: 36px;
          }
        }

        .completion-text {
          color: #6b7280;
          margin: 0;
        }

        .course-section {
          text-align: center;
        }

        .course-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        @media (min-width: 768px) {
          .course-title {
            font-size: 30px;
          }
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          max-width: 672px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 768px) {
          .details-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          background-color: #f8fafc;
        }

        .detail-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #0ea5a4;
        }

        .detail-content {
          flex: 1;
          min-width: 0;
        }

        .detail-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .detail-value {
          font-weight: 500;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .footer-section {
          padding-top: 32px;
          border-top: 1px solid #e5e7eb;
        }

        .footer-spacing {
          margin-bottom: 24px;
        }

        .footer-row {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .footer-row {
            flex-direction: row;
          }
        }

        .footer-item {
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-item-left {
            text-align: left;
          }

          .footer-item-right {
            text-align: right;
          }
        }

        .footer-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .footer-value {
          font-weight: 600;
          font-size: 18px;
          margin: 0;
        }

        .footer-cert-id {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }

        .footer-text {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .footer-brand {
          font-weight: 600;
          color: #111827;
        }
      `}</style>

      <div id="certificate-template" className="certificate-container">
        {/* Certificate Content */}
        <div className="cert-content">
          {/* Header */}
          <div className="cert-section cert-header">
            <div className="cert-header-spacing">
              <div className="icon-container">
                <div className="icon-wrapper">
                  <Award className="icon-large" />
                </div>
              </div>
            </div>
            <div className="title-spacing">
              <h1 className="main-title">Certificate of Completion</h1>
              <p className="subtitle">This certifies that</p>
            </div>
          </div>

          {/* Student Name */}
          <div className="cert-section student-section">
            <div className="student-section-spacing">
              <h2 className="student-name">{certificate.studentName}</h2>
              <p className="completion-text">
                has successfully completed the course
              </p>
            </div>
          </div>

          {/* Course Title */}
          <div className="cert-section course-section">
            <div className="student-section-spacing">
              <h3 className="course-title">{certificate.courseTitle}</h3>
            </div>
          </div>

          {/* Course Details */}
          <div className="cert-section">
            <div className="details-grid">
              <div className="detail-card">
                <GraduationCap className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Level</p>
                  <p className="detail-value">{certificate.courseLevel}</p>
                </div>
              </div>

              <div className="detail-card">
                <Clock className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Duration</p>
                  <p className="detail-value">
                    {certificate.courseDuration} hours
                  </p>
                </div>
              </div>

              <div className="detail-card">
                <Calendar className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Completed On</p>
                  <p className="detail-value">
                    {formatDate(certificate.completionDate, "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="detail-card">
                <Shield className="detail-icon" />
                <div className="detail-content">
                  <p className="detail-label">Category</p>
                  <p className="detail-value">{certificate.courseCategory}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-section">
            <div className="footer-spacing">
              <div className="footer-row">
                <div className="footer-item footer-item-left">
                  <p className="footer-label">Instructor</p>
                  <p className="footer-value">{certificate.instructorName}</p>
                </div>
                <div className="footer-item footer-item-right">
                  <p className="footer-label">Certificate ID</p>
                  <p className="footer-cert-id">{certificate.certificateId}</p>
                </div>
              </div>
            </div>

            <div className="footer-text">
              <p>
                Issued by <span className="footer-brand">Lerna</span> - Modern
                Learning Management System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
