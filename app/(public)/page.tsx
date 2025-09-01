import { Hero } from "./_components/Hero";
import { HorizontalScrollFeatures } from "./_components/HorizontalScrollFeatures";
import { ContentSections } from "./_components/ContentSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <HorizontalScrollFeatures />
      <ContentSections />
    </div>
  );
}
