import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { HorizontalScrollFeatures } from "./_components/HorizontalScrollFeatures";
import { ContentSections } from "./_components/ContentSections";
import { Footer } from "./_components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HorizontalScrollFeatures />
        <ContentSections />
      </main>
      <Footer />
    </div>
  );
}
