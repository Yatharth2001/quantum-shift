import { GameWrapper } from "@/components/game/GameWrapper";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <GameWrapper />
    </Suspense>
  );
}
