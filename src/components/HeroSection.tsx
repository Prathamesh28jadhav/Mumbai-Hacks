"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import ThreeModel from "./ThreeModel";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (titleRef.current && textRef.current && ctaRef.current) {
      tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" })
        .fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
        .fromTo(ctaRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1,0.6)" }, "-=0.3");
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 lg:gap-12">
      {/* left: content */}
      <div className="max-w-2xl lg:w-1/2 pt-24 lg:pt-0">
        <h2 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Agentic AI that <span className="text-blue-400">detects</span> and <span className="text-indigo-400">explains</span> misinformation — in real time.
        </h2>

        <p ref={textRef} className="mt-6 text-gray-300 text-lg sm:text-xl max-w-2xl">
          Continuously scans news and social feeds, verifies claims with trusted sources, summarizes context, and pushes clear updates during crises so the public and responders can act on facts.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/dashboard" ref={ctaRef} className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            Explore Dashboard
          </Link>

          <a href="#how-it-works" className="text-gray-300 hover:text-white">
            Learn how it works →
          </a>
        </div>
      </div>

      {/* right: 3D model */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:pr-12 mt-12 lg:mt-0">
        <ThreeModel />
      </div>
    </section>
  );
}
