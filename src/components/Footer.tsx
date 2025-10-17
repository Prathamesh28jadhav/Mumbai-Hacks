import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 py-8 bg-black/30 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-gray-400">
        <div className="mb-2">© {new Date().getFullYear()} MisinfoHub — Built for Mumbai Hacks</div>
        <div className="text-sm">Privacy-first, explainable AI for crisis communication.</div>
      </div>
    </footer>
  );
}
