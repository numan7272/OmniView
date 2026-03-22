import { NextResponse } from "next/server";

interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
  };
}

const TRACKED_ASSETS = {
  crypto: ["bitcoin", "ethereum", "solana"],
  // Stocks/commodities approximated via crypto-traded indices where possible
};

export async function GET() {
  try {
    // CoinGecko free API - no key needed
    const ids = TRACKED_ASSETS.crypto.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Price API unavailable" },
        { status: 502 }
      );
    }

    const data: CoinGeckoPrice = await res.json();

    const tickers = Object.entries(data).map(([id, info]) => ({
      id,
      symbol: id === "bitcoin" ? "BTC" : id === "ethereum" ? "ETH" : id === "solana" ? "SOL" : id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: info.usd,
      change24h: info.usd_24h_change,
      volume24h: info.usd_24h_vol,
      marketCap: info.usd_market_cap,
    }));

    // Add gold and oil estimates via CoinGecko's commodity-pegged tokens
    const commodityRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,tether&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 60 } }
    );

    if (commodityRes.ok) {
      const commodityData: CoinGeckoPrice = await commodityRes.json();
      if (commodityData["pax-gold"]) {
        tickers.push({
          id: "gold",
          symbol: "XAU",
          name: "Gold",
          price: commodityData["pax-gold"].usd,
          change24h: commodityData["pax-gold"].usd_24h_change,
          volume24h: 0,
          marketCap: 0,
        });
      }
    }

    return NextResponse.json({ tickers, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Ticker error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
