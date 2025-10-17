"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const logos = [
  "/logos/google.png",
  "/logos/gaurdian.png",
  "/logos/bbc.png",
  "/logos/reuters.png",
  "/logos/factcheck.png"
];

export default function TrustedSources() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll<HTMLDivElement>(".logo-item");
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#03101a] via-[#071826] to-[#021018]">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl font-extrabold text-white mb-8">Trusted by Leading Fact-Checkers</h3>
        <div ref={containerRef} className="flex flex-wrap justify-center items-center gap-6">
          {logos.map((logo, i) => (
            <div key={i} className="logo-item w-28 h-16 flex items-center justify-center p-2 bg-white/5 rounded-lg hover:scale-105 transition-transform duration-300">
              <img src={logo} alt={`Trusted Source ${i + 1}`} className="max-h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
