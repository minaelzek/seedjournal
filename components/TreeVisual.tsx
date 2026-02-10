"use client";

import clsx from "clsx";
import type { TreeStage } from "@/lib/types";

interface TreeVisualProps {
  stage: TreeStage;
  pulseKey: number;
}

export function TreeVisual({ stage, pulseKey }: TreeVisualProps) {
  const sway = stage === "young-tree" || stage === "tree" || stage === "flourishing";

  return (
    <div className={clsx("mx-auto w-full max-w-md", sway && "origin-bottom animate-sway")}>
      <svg
        key={pulseKey}
        viewBox="0 0 320 260"
        role="img"
        aria-label={`Tree stage ${stage}`}
        className="h-[280px] w-full animate-pulseGrow"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="90%" r="70%">
            <stop offset="0%" stopColor="#2b3443" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#11151e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="160" cy="220" rx="110" ry="30" fill="url(#glow)" />
        <rect x="0" y="215" width="320" height="45" fill="#0f1115" />

        {stage === "seed" && <ellipse cx="160" cy="198" rx="14" ry="10" fill="#8b6a45" />}

        {stage === "sprout" && (
          <>
            <ellipse cx="160" cy="200" rx="12" ry="8" fill="#8b6a45" />
            <path d="M160 198 C160 185 160 175 160 168" stroke="#9aa6b9" strokeWidth="3" />
            <ellipse cx="151" cy="167" rx="10" ry="5" fill="#6b8f7d" transform="rotate(-25 151 167)" />
            <ellipse cx="169" cy="167" rx="10" ry="5" fill="#6b8f7d" transform="rotate(25 169 167)" />
          </>
        )}

        {(stage === "sapling" || stage === "young-tree" || stage === "tree" || stage === "flourishing") && (
          <path d="M160 208 C160 178 159 145 160 120" stroke="#7f6b58" strokeWidth="10" strokeLinecap="round" />
        )}

        {(stage === "sapling" || stage === "young-tree" || stage === "tree" || stage === "flourishing") && (
          <>
            <ellipse cx="135" cy="132" rx="26" ry="16" fill="#3f5d52" />
            <ellipse cx="184" cy="124" rx="30" ry="20" fill="#48695c" />
          </>
        )}

        {(stage === "young-tree" || stage === "tree" || stage === "flourishing") && (
          <>
            <path d="M160 145 C145 135 132 120 122 102" stroke="#7f6b58" strokeWidth="7" strokeLinecap="round" />
            <path d="M160 138 C176 126 190 108 198 94" stroke="#7f6b58" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="116" cy="96" rx="28" ry="20" fill="#4c6f61" />
            <ellipse cx="203" cy="88" rx="32" ry="22" fill="#537969" />
          </>
        )}

        {(stage === "tree" || stage === "flourishing") && (
          <>
            <ellipse cx="160" cy="86" rx="58" ry="36" fill="#557d6d" />
            <ellipse cx="126" cy="74" rx="30" ry="20" fill="#4b7163" />
            <ellipse cx="196" cy="72" rx="32" ry="20" fill="#4d7364" />
          </>
        )}

        {stage === "flourishing" && (
          <>
            <circle cx="131" cy="88" r="4" fill="#a6b4c5" opacity="0.75" />
            <circle cx="175" cy="66" r="4" fill="#a6b4c5" opacity="0.8" />
            <circle cx="201" cy="94" r="4" fill="#a6b4c5" opacity="0.75" />
          </>
        )}
      </svg>
    </div>
  );
}
