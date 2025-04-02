import "@fontsource/jetbrains-mono";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum Shift: The Math Paradox",
  description:
    "A math-based puzzle game with quantum mechanics and time manipulation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {children}
      </body>
    </html>
  );
}
