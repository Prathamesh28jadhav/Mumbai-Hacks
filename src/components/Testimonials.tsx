"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ravi Sharma",
    role: "NGO Volunteer",
    message: "This AI helped us quickly identify misinformation during local crises. Clear summaries saved us hours of work!"
  },
  {
    name: "Ananya Mehta",
    role: "Journalist",
    message: "The verification pipeline is fast and reliable. Our team can now report with confidence."
  },
  {
    name: "Siddharth Rao",
    role: "Public Safety Officer",
    message: "Real-time updates from the system improved our crisis response tremendously."
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll<HTMLDivElement>(".testimonial-item");
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#03101A] to-[#07101A]">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl font-extrabold text-white mb-12">What Our Users Say</h3>
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-item p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col gap-4">
              <Quote className="w-6 h-6 text-blue-400 mx-auto" />
              <p className="text-gray-300 text-sm">{t.message}</p>
              <div className="mt-4 text-center">
                <h4 className="text-white font-semibold">{t.name}</h4>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
