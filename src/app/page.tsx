import Header from "@/components/Header";
import MarketTickerBar from "@/components/MarketTickerBar";
import StatsBar from "@/components/StatsBar";
import NewsStream from "@/components/NewsStream";
import NarrativeClustering from "@/components/NarrativeClustering";
import ReporterBiasTracker from "@/components/ReporterBiasTracker";
import InvestmentSignals from "@/components/InvestmentSignals";
import SentimentChart from "@/components/SentimentChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col">
      {/* Sticky header */}
      <Header />

      {/* Market ticker */}
      <MarketTickerBar />

      {/* Main content */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 py-4">
        {/* Stats row */}
        <StatsBar />

        {/* Main grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left column — News Stream */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="h-[700px]">
              <NewsStream />
            </div>
          </div>

          {/* Center column — Clusters + Chart */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <NarrativeClustering />
            <SentimentChart />
          </div>

          {/* Right column — Signals + Bias */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <InvestmentSignals />
            <ReporterBiasTracker />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] px-6 py-3 text-center">
        <p className="text-[10px] text-[#334155]">
          OmniView AI · Global Sentiment & Arbitrage Engine · Data refreshed in real-time ·
          Not financial advice
        </p>
      </footer>
    </div>
  );
}
