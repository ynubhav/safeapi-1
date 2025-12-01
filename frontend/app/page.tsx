import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Steps from "@/components/landing/Steps";
import Navbar from "@/components/navbar";


export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Steps />
      <CTA />
    </main>
  );
}
