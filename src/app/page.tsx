import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import TrustedSources from "@/components/TrustedSources";
import Testimonials from "@/components/Testimonials";

export default function Page() {
  return (
    <div className="bg-gradient-to-b from-[#03101a] via-[#071826] to-[#021018] min-h-screen text-white">
      <Navbar />
      <main className="pt-24">
        <HeroSection />
        <FeaturesGrid />
        <TrustedSources />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
