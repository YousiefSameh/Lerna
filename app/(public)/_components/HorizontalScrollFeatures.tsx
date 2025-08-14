"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Video,
  MessageSquare,
  Award,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Course Builder",
    description:
      "Intuitive drag-and-drop course creation with multimedia support and interactive elements.",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Student Management",
    description:
      "Comprehensive student tracking, progress monitoring, and engagement analytics.",
    color: "text-green-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Deep insights into learning patterns, completion rates, and performance metrics.",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with SSO, SCORM compliance, and data protection.",
    color: "text-red-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance with CDN delivery and instant content loading.",
    color: "text-yellow-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Multi-language support with localization and timezone management.",
    color: "text-indigo-500",
  },
  {
    icon: Video,
    title: "Video Streaming",
    description:
      "HD video delivery with adaptive streaming and offline viewing capabilities.",
    color: "text-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    description:
      "Built-in community features with threaded discussions and peer learning.",
    color: "text-teal-500",
  },
  {
    icon: Award,
    title: "Certifications",
    description:
      "Automated certificate generation with blockchain verification options.",
    color: "text-orange-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Responsive design with native mobile apps for iOS and Android.",
    color: "text-cyan-500",
  },
];

export function HorizontalScrollFeatures() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollDelay = 50;

    const autoScroll = () => {
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollAmount += scrollStep;
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(autoScroll, scrollDelay);

    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => {
      const newInterval = setInterval(autoScroll, scrollDelay);
      return newInterval;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(interval);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <section id="features" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Everything you need to
            <span className="block text-primary">teach and learn</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make online education engaging,
            effective, and accessible for everyone.
          </p>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 p-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`min-w-[320px] hover:shadow-lg transition-all duration-300 hover:-translate-y-2 scroll-animate ${
                  isVisible ? "animate" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
