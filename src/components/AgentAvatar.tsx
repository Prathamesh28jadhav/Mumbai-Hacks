"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function AgentAvatar() {
  return (
    <div className="absolute top-10 right-10 w-48 h-48 md:w-64 md:h-64">
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 2, 5]} intensity={2} />
        <Suspense fallback={null}>
          <RobotModel />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}

function RobotModel() {
  const { scene } = useGLTF("/models/agent-avatar.glb");
  const ref = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);

  // Fade-in on mount
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
      ref.current.rotation.y += 0.01; // subtle rotation
      ref.current.traverse((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.Material & { opacity?: number, transparent?: boolean };
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
    }
  });

  return <primitive ref={ref} object={scene} scale={1.2} />;
}
