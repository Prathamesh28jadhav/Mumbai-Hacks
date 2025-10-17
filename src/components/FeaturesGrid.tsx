"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Check } from "lucide-react";

const FeatureCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  return (
    <div className="feature-card bg-white/4 p-6 rounded-2xl border border-white/6">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-blue-600/20">
          <Check className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-sm text-gray-300 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default function FeaturesGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll(".feature-card");

    // ✅ Only run GSAP if items exist
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl text-white font-extrabold mb-6">How it works</h3>
        <p className="text-gray-300 max-w-3xl mb-8">
          We combine streaming data, automated cross-checks against verified databases,
          and human-in-the-loop validation for high-confidence updates.
        </p>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Scan" desc="Continuously collects articles, posts & alerts across channels." />
          <FeatureCard title="Verify" desc="Cross-references claims with trusted fact-check databases and official sources." />
          <FeatureCard title="Explain" desc="Generates short summaries and clear guidance using AI." />
          <FeatureCard title="Visualize" desc="Maps misinformation spread and identifies super-spreaders." />
          <FeatureCard title="Alert" desc="Sends contextual, severity-based public updates and recommended actions." />
          <FeatureCard title="Community" desc="Users can flag content and contribute human reviews for models to learn." />
        </div>
      </div>
    </section>
  );
}
