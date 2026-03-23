"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { gsap } from "gsap";

const sampleData = [
  { day: "Mon", verified: 5, partial: 3, unverified: 8 },
  { day: "Tue", verified: 8, partial: 2, unverified: 6 },
  { day: "Wed", verified: 6, partial: 5, unverified: 9 },
  { day: "Thu", verified: 9, partial: 4, unverified: 3 },
  { day: "Fri", verified: 7, partial: 3, unverified: 5 },
];

export default function TrendGraph() {
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chartRef.current) {
      gsap.fromTo(chartRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 });
    }
  }, []);

  return (
    <div ref={chartRef} className="mt-10 p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/20 shadow-[0_0_20px_#00ffff20]">
      <h3 className="text-cyan-400 font-semibold mb-4 text-center">📈 Misinformation Trend (Weekly)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampleData}>
          <XAxis dataKey="day" stroke="#00ffff" />
          <YAxis stroke="#00ffff" />
          <Tooltip contentStyle={{ backgroundColor: "#0c0c0c", border: "1px solid #00ffff" }} />
          <Legend wrapperStyle={{ color: "#00ffff" }} />
          <Line type="monotone" dataKey="verified" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="partial" stroke="#eab308" strokeWidth={2} />
          <Line type="monotone" dataKey="unverified" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
