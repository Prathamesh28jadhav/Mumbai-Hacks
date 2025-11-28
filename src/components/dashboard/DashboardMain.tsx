"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ------------------------- Article Interface -------------------------
interface Article {
  title: string;
  source: { name: string };
  publishedAt: string;
  description: string;
  url: string;
  status?: "verified" | "partial" | "unverified";
  summary?: string;
}
// ------------------------- Dashboard Main -------------------------
export default function DashboardMain() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // GSAP entry animations for hero & search bar
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-title span", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "back.out(1.7)" });
    tl.fromTo(".search-bar", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "bounce.out" }, "-=0.3");
  }, []);

  // GSAP hover effect for article cards
  useEffect(() => {
    const cards = document.querySelectorAll(".article-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { rotateY: 5, scale: 1.03, boxShadow: "0 0 20px #3b82f6", duration: 0.4 });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateY: 0, scale: 1, boxShadow: "0 0 0px transparent", duration: 0.3 });
      });
    });
  }, [articles]);

  // Search articles
  const searchArticles = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("/api/news/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setArticles(data.articles || []);
      gsap.fromTo(".article-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1 });
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verify article
  const handleVerify = async (article: Article, index: number) => {
    try {
      const res = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          claim: article.title,
          articleUrl: article.url,
          articleContent: article.description
        }),
      });
      const data = await res.json();
      setArticles((prev) => {
        const copy = [...prev];
        copy[index].status = data.status;
        copy[index].summary = data.summary;
        return copy;
      });
      gsap.fromTo(
        `.article-card:nth-child(${index + 1})`, 
        { boxShadow: "0 0 0px #00f2ff" }, 
        { boxShadow: "0 0 30px #00f2ff", duration: 0.4, yoyo: true, repeat: 1 }
      );
    } catch (err) {
      console.error("Verify failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#03101a] via-[#071826] to-[#021018] text-white p-8 overflow-hidden">
      {/* ---------------- Agent Avatar ---------------- */}
      <AgentAvatar />

      {/* ---------------- Hero Title ---------------- */}
      <h1 className="hero-title text-4xl md:text-5xl font-extrabold text-center mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        {"Misinformation Dashboard".split("").map((char, i) => <span key={i}>{char}</span>)}
      </h1>

      {/* ---------------- Search Bar ---------------- */}
      <div className="search-bar flex justify-center mb-10 gap-2">
        <Input 
          type="text" 
          placeholder="Search for a topic..." 
          className="w-full md:w-1/2 bg-white/10 text-white border-white/20" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <Button onClick={searchArticles} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* ---------------- Articles Grid with Enhanced Badges ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <Card 
            key={i} 
            className={`article-card bg-white/5 p-4 border backdrop-blur-md transition-all duration-300 ${
              a.status === "verified" 
                ? "border-green-500/30 hover:border-green-500/60" 
                : a.status === "partial" 
                ? "border-white/30 hover:border-white/60" 
                : a.status === "unverified"
                ? "border-red-500/30 hover:border-red-500/60"
                : "border-white/10"
            }`}
          >
            <h3 className="font-semibold text-lg mb-1 text-white">{a.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{a.description}</p>
            
            <div className="flex justify-between items-center">
              <Button size="sm" onClick={() => handleVerify(a, i)}>
                Verify
              </Button>
              
              {a.status && (
                <div className={`px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 transition-all duration-300 ${
                  a.status === "verified" 
                    ? "bg-green-500 text-white border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]" 
                    : a.status === "partial" 
                    ? "bg-white text-black border-2 border-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                    : "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                }`}>
                  <span>{a.status === "verified" ? "✅" : a.status === "partial" ? "⚠️" : "❌"}</span>
                  <span>{a.status.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            {a.summary && (
              <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <div className="text-sm text-gray-200">
                  <strong className="text-cyan-400">AI Summary:</strong> {a.summary}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
}

// ------------------------- Agent Avatar -------------------------
function AgentAvatar() {
  return (
    <div className="absolute top-4 right-4 w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 z-10 pointer-events-none">
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 5]} intensity={2} />
        <Suspense fallback={null}><RobotModel /></Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}

function RobotModel() {
  const { scene } = useGLTF("/models/agent-avatar.glb");
  const ref = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let frame = 0;
    const id = requestAnimationFrame(function animate() {
      frame += 0.02;
      setOpacity(Math.min(frame, 1));
      if (frame < 1) requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.traverse((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.Material & { opacity?: number; transparent?: boolean; };
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
    }
  });

  return <primitive ref={ref} object={scene} scale={1.2} />;
}