"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button"; // from shadcn
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold">MH</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">MisinfoHub</h1>
            <p className="text-xs text-gray-300 -mt-1">Agentic AI for crisis truth</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/register" className="hidden md:inline">
            <Button variant="ghost">Register</Button>
          </Link>
          <Link href="/login" className="hidden md:inline">
            <Button variant="ghost">Login</Button>
          </Link>

         
        </div>
      </nav>
    </header>
  );
}
