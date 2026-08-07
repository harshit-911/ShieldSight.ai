import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { PrivacyFirst } from '../components/PrivacyFirst';
import { PresentationSection } from '../components/PresentationSection';
import { FAQ } from '../components/FAQ';
import { DownloadSection } from '../components/DownloadSection';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-slate-100 overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <PrivacyFirst />
      <PresentationSection />
      <FAQ />
      <DownloadSection />
      <Footer />
    </main>
  );
}
