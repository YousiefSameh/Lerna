import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

export default function LayoutPublic({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}