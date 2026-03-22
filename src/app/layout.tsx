import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniView AI — Global Sentiment & Arbitrage Engine",
  description:
    "Real-time global news sentiment analysis across 40+ countries. Dynamic narrative clustering, reporter bias tracking, and AI-powered investment signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060c18] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
