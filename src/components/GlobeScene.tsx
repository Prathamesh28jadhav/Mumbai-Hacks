"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";

const GlobeScene = () => {
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
        <Suspense fallback={null}>
          <Sphere args={[1.3, 100, 200]} scale={1.5}>
            <MeshDistortMaterial
              color="#3b82f6"
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.2}
            />
          </Sphere>
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
};

export default GlobeScene;
