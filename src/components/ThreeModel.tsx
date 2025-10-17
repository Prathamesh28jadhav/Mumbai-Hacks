"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

export default function ThreeModel() {
  return (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px]">
      <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}

function Model() {
  const { scene } = useGLTF("/models/misinformation_model.glb");
  return <primitive object={scene} scale={1.5} />;
}
