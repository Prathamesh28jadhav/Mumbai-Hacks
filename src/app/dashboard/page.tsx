"use client";

import React from "react";

import DashboardMain from "@/components/dashboard/DashboardMain";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03101a] via-[#071826] to-[#021018] text-white">
      
      

      {/* Main Dashboard */}
      <main className="pt-24 px-6 md:px-12">
        <DashboardMain />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
