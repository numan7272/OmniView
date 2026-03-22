import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniView AI - Global Sentiment & Arbitrage Engine",
  description:
    "Break through filter bubbles with AI-powered global news analysis, narrative clustering, and investment signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#0a0a0f] font-sans text-zinc-100">
        {children}
      </body>
    </html>
  );
}
