import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lerna LMS Courses Platform",
    template: "%s | Lerna LMS",
  },
  description:
    "Lerna is a modern, fully-featured Learning Management System (LMS) built for creators, educators, and students.",
  keywords: [
    "LMS",
    "learning management system",
    "online courses",
    "education",
    "e-learning",
    "Next.js",
    "Tailwind CSS",
  ],
  authors: [
    { name: "Your Name", url: "https://your-website.com" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
