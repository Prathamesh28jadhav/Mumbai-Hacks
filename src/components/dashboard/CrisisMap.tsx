"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { hotspots } from "./hotspotsData";

// Helper: lat/lng -> 3D coords
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Globe
function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    globeRef.current.rotation.y += 0.002;
  });
  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial color="#0ff" wireframe transparent opacity={0.25} emissive="#00ffff" emissiveIntensity={0.4} />
    </mesh>
  );
}

// Hotspot
function Hotspot({ data }: { data: any }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const colorMap: Record<string, string> = { verified: "#22c55e", partial: "#eab308", unverified: "#ef4444" };
  const basePosition = useMemo(() => {
    const pos = latLngToVector3(data.lat, data.lng, 2.1);
    pos.multiplyScalar(1 + data.count * 0.01);
    return pos;
  }, [data]);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, { x: 1.3, y: 1.3, z: 1.3, yoyo: true, repeat: -1, duration: 1.5 + Math.random(), ease: "sine.inOut" });
    }
  }, []);

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

// Main CrisisMap
export default function CrisisMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" });
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[450px] bg-gradient-to-b from-black via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_#00ffff20] mt-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade />
        <Globe />
        {hotspots.map((data, i) => <Hotspot key={i} data={data} />)}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-cyan-400 text-lg font-semibold drop-shadow-[0_0_10px_#00ffff90]">
        🌌 India Misinformation Hologram Map
      </div>
    </div>
  );
}
