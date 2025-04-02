"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { GameErrorBoundary } from "./GameErrorBoundary";

const GameWithNoSSR = dynamic(() => import("./Game").then((mod) => mod.Game), {
  ssr: false,
});

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black">
    <div className="text-center">
      <h1 className="text-4xl text-cyan-500 mb-4 font-bold animate-pulse">
        Quantum Shift
      </h1>
      <p className="text-white">Initializing quantum mechanics...</p>
    </div>
  </div>
);

export const GameWrapper = () => {
  return (
    <GameErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <main className="relative min-h-screen overflow-hidden">
          <GameWithNoSSR />
        </main>
      </Suspense>
    </GameErrorBoundary>
  );
};
