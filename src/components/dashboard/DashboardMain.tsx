"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Bar } from "recharts";

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

// ------------------------- Hotspots Data -------------------------
const hotspots = [
  {
    lat: 28.7041,
    lng: 77.1025,
    country: "India – Delhi",
    topic: "Politics",
    status: "unverified",
    count: 20,
  },
  {
    lat: 19.0760,
    lng: 72.8777,
    country: "India – Mumbai",
    topic: "Climate",
    status: "partial",
    count: 15,
  },
  {
    lat: 13.0827,
    lng: 80.2707,
    country: "India – Chennai",
    topic: "Health",
    status: "verified",
    count: 9,
  },
  {
    lat: 22.5726,
    lng: 88.3639,
    country: "India – Kolkata",
    topic: "Economy",
    status: "unverified",
    count: 12,
  },
  {
    lat: 12.9716,
    lng: 77.5946,
    country: "India – Bengaluru",
    topic: "Technology",
    status: "partial",
    count: 11,
  },
  {
    lat: 17.3850,
    lng: 78.4867,
    country: "India – Hyderabad",
    topic: "Education",
    status: "unverified",
    count: 13,
  },
  {
    lat: 26.9124,
    lng: 75.7873,
    country: "India – Jaipur",
    topic: "Cultural Heritage",
    status: "verified",
    count: 8,
  },
  {
    lat: 25.3176,
    lng: 82.9739,
    country: "India – Varanasi",
    topic: "Religious Narratives",
    status: "partial",
    count: 10,
  },
  {
    lat: 23.2599,
    lng: 77.4126,
    country: "India – Bhopal",
    topic: "Environment",
    status: "unverified",
    count: 7,
  },
  {
    lat: 26.1445,
    lng: 91.7362,
    country: "India – Guwahati",
    topic: "Regional Conflicts",
    status: "partial",
    count: 9,
  },
];


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
        body: JSON.stringify({ claim: article.title }),
      });
      const data = await res.json();
      setArticles((prev) => {
        const copy = [...prev];
        copy[index].status = data.status;
        copy[index].summary = data.summary;
        return copy;
      });
      gsap.fromTo(`.article-card:nth-child(${index + 1})`, { boxShadow: "0 0 0px #00f2ff" }, { boxShadow: "0 0 30px #00f2ff", duration: 0.4, yoyo: true, repeat: 1 });
    } catch (err) {
      console.error("Verify failed:", err);
    }
  };

  const badgeMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
    verified: "default",
    partial: "secondary",
    unverified: "destructive",
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
        <Input type="text" placeholder="Search for a topic..." className="w-full md:w-1/2 bg-white/10 text-white border-white/20" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={searchArticles} disabled={loading}>{loading ? "Searching..." : "Search"}</Button>
      </div>

      {/* ---------------- Articles Grid ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <Card key={i} className="article-card bg-white/5 p-4 border border-white/10 backdrop-blur-md">
            <h3 className="font-semibold text-lg mb-1 text-white">{a.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{a.description}</p>
            <div className="flex justify-between items-center">
              <Button size="sm" onClick={() => handleVerify(a, i)}>Verify</Button>
              {a.status && <Badge variant={badgeMap[a.status]}>{a.status.toUpperCase()}</Badge>}
            </div>
            {a.summary && <div className="mt-3 text-sm text-gray-200"><strong>AI Summary:</strong> {a.summary}</div>}
          </Card>
        ))}
      </div>

      {/* ---------------- Crisis Map & Trend Graph Side by Side ---------------- */}
      <div className="mt-10 flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <CrisisMap />
        </div>
        <div className="flex-1">
          <TrendGraph />
        </div>
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

// ------------------------- Crisis Map -------------------------
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!);
  useFrame(() => { globeRef.current.rotation.y += 0.002; });
  return <mesh ref={globeRef}><sphereGeometry args={[2, 64, 64]} /><meshStandardMaterial color="#0ff" wireframe transparent opacity={0.25} emissive="#00ffff" emissiveIntensity={0.4} /></mesh>;
}

function Hotspot({ data }: { data: any }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const colorMap: Record<string, string> = { verified: "#22c55e", partial: "#eab308", unverified: "#ef4444" };
  const basePosition = useMemo(() => { const pos = latLngToVector3(data.lat, data.lng, 2.1); pos.multiplyScalar(1 + data.count * 0.01); return pos; }, [data]);

  useEffect(() => { if (meshRef.current) { gsap.to(meshRef.current.scale, { x: 1.3, y: 1.3, z: 1.3, yoyo: true, repeat: -1, duration: 1.5 + Math.random(), ease: "sine.inOut" }); } }, []);

  return (
    <group position={basePosition}>
      <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={colorMap[data.status]} emissive={colorMap[data.status]} emissiveIntensity={hovered ? 2.5 : 1.5} />
      </mesh>
      {hovered && (
        <Html position={[0, 0.15, 0]} center>
          <div className="px-3 py-2 bg-black/80 text-cyan-300 text-xs rounded-lg border border-cyan-400/40 backdrop-blur-md">
            <div className="font-semibold">{data.country}</div>
            <div className="text-gray-300">{data.topic}</div>
            <div className="text-cyan-400">{data.status.toUpperCase()} • {data.count} articles</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CrisisMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => { gsap.fromTo(containerRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }); }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400px] bg-gradient-to-b from-black via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_#00ffff20]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade />
        <Globe />
        {hotspots.map((h, i) => <Hotspot key={i} data={h} />)}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-cyan-400 text-lg font-semibold drop-shadow-[0_0_10px_#00ffff90]">🌌 Global Misinformation Hologram Map</div>
    </div>
  );
}

// ------------------------- Trend Graph -------------------------
function TrendGraph() {
  const [view, setView] = useState<"line" | "bar">("line");
  const [trendType, setTrendType] = useState<"daily" | "cumulative">("daily");

  const trendData = useMemo(() => {
    const dailyData = hotspots.map((h, idx) => ({
      day: `Day ${idx + 1}`,
      verified: h.status === "verified" ? h.count : 0,
      partial: h.status === "partial" ? h.count : 0,
      unverified: h.status === "unverified" ? h.count : 0,
    }));

    if (trendType === "cumulative") {
      let cumVerified = 0, cumPartial = 0, cumUnverified = 0;
      return dailyData.map((d) => {
        cumVerified += d.verified;
        cumPartial += d.partial;
        cumUnverified += d.unverified;
        return { ...d, verified: cumVerified, partial: cumPartial, unverified: cumUnverified };
      });
    }

    return dailyData;
  }, [trendType]);

  return (
    <div className="w-full h-[400px] bg-black/60 rounded-2xl border border-cyan-500/20 p-4 flex flex-col gap-3">
      {/* Chart Controls */}
      <div className="flex justify-between items-center mb-2 text-cyan-400">
        <div>
          <Button variant={view === "line" ? "default" : "outline"} size="sm" className="mr-2" onClick={() => setView("line")}>Line Chart</Button>
          <Button variant={view === "bar" ? "default" : "outline"} size="sm" onClick={() => setView("bar")}>Bar Chart</Button>
        </div>
        <div>
          <Button variant={trendType === "daily" ? "default" : "outline"} size="sm" className="mr-2" onClick={() => setTrendType("daily")}>Daily</Button>
          <Button variant={trendType === "cumulative" ? "default" : "outline"} size="sm" onClick={() => setTrendType("cumulative")}>Cumulative</Button>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {view === "line" ? (
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#00ffff" />
              <YAxis stroke="#00ffff" />
              <Tooltip contentStyle={{ backgroundColor: "#000000AA", border: "1px solid #00ffff", color: "#00ffff" }} />
              <Legend wrapperStyle={{ color: "#00ffff" }} />
              <Line type="monotone" dataKey="verified" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="partial" stroke="#eab308" strokeWidth={2} />
              <Line type="monotone" dataKey="unverified" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          ) : (
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#00ffff" />
              <YAxis stroke="#00ffff" />
              <Tooltip contentStyle={{ backgroundColor: "#000000AA", border: "1px solid #00ffff", color: "#00ffff" }} />
              <Legend wrapperStyle={{ color: "#00ffff" }} />
              <Bar dataKey="verified" fill="#22c55e" />
              <Bar dataKey="partial" fill="#eab308" />
              <Bar dataKey="unverified" fill="#ef4444" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
