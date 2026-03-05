"use client";

import { Timeline } from "@/components/ui/timeline";

export default function HowItWorksTimeline() {
  const data = [
    {
      title: "Upload",
      content: (
        <p className="text-lg text-white/70 max-w-xl leading-relaxed group-hover:text-white transition-all duration-300">
          Drop raw video footage from any device or cloud source.
        </p>
      ),
    },
    {
      title: "Analyze",
      content: (
        <p className="text-lg text-white/70 max-w-xl leading-relaxed group-hover:text-white transition-all duration-300">
          Scene Intelligence dissects every frame in seconds using AI.
        </p>
      ),
    },
    {
      title: "Filter",
      content: (
        <p className="text-lg text-white/70 max-w-xl leading-relaxed group-hover:text-white transition-all duration-300">
          Privacy-first AI ensures compliance and authenticity.
        </p>
      ),
    },
    {
      title: "Optimize",
      content: (
        <p className="text-lg text-white/70 max-w-xl leading-relaxed group-hover:text-white transition-all duration-300">
          Trend Prediction finds the best format and timing automatically.
        </p>
      ),
    },
    {
      title: "Distribute",
      content: (
        <p className="text-lg text-white/70 max-w-xl leading-relaxed group-hover:text-white transition-all duration-300">
          Automated publishing to 40+ global platforms.
        </p>
      ),
    },
  ];

  return (
    <section id="how" className="relative w-full py-24">
      <div className="max-w-7xl mx-auto">
        <Timeline data={data} />
      </div>
    </section>
  );
}
