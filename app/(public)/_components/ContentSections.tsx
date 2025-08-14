"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  TrendingUp,
  Users,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";

export function ContentSections() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = Number.parseInt(
              entry.target.getAttribute("data-section") || "0"
            );
            setVisibleSections((prev) => new Set([...prev, sectionIndex]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const benefits = [
    "Reduce course creation time by 70%",
    "Increase student engagement by 3x",
    "Scale to unlimited students",
    "24/7 automated support",
    "Advanced analytics & insights",
    "Mobile-first learning experience",
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Online Course Creator",
      content:
        "Lerna transformed how I deliver content to my students. The engagement rates have tripled since switching.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Corporate Trainer",
      content:
        "The analytics dashboard gives me insights I never had before. I can see exactly where students struggle.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "University Professor",
      content:
        "Finally, an LMS that doesn't feel like it was built in 2005. My students actually enjoy using it.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: TrendingUp, value: "300%", label: "Average engagement increase" },
    { icon: Users, value: "50K+", label: "Active educators" },
    { icon: Clock, value: "70%", label: "Time saved on course creation" },
    { icon: Award, value: "99.8%", label: "Customer satisfaction" },
  ];

  return (
    <>
      {/* About Section */}
      <section id="about" className="py-24 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              data-section="1"
              className={`transition-all duration-1000 ${
                visibleSections.has(1)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <Badge className="mb-4">Why Choose Lerna</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for the future of
                <span className="block text-primary">online education</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand that great learning experiences require more than
                just content delivery. Lerna combines cutting-edge technology
                with pedagogical best practices to create platforms that truly
                engage and educate.
              </p>
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div
              data-section="1"
              className={`transition-all duration-1000 delay-300 ${
                visibleSections.has(1)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="text-center p-6">
                      <CardContent className="p-0">
                        <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            data-section="2"
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has(2)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Loved by educators
              <span className="block text-primary">worldwide</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of educators who have transformed their teaching
              with Lerna.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                data-section="2"
                className={`transition-all duration-1000 hover:shadow-lg hover:-translate-y-2 ${
                  visibleSections.has(2)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    &quote;{testimonial.content}&quote;
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <div
            data-section="3"
            className={`transition-all duration-1000 ${
              visibleSections.has(3)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your teaching?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are already creating amazing
              learning experiences with Lerna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "!bg-background !text-foreground",
                })}
              >
                Explore Courses
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "!border-background !text-background",
                })}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
