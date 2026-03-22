# OmniView AI — Global Sentiment & Arbitrage Engine

A professional Bloomberg Terminal–style web dashboard that collects and analyzes live global news from 40+ countries, performs AI-driven narrative clustering, tracks reporter bias, and generates investment signals from asymmetric global information.

## Features

### 🌐 Global News Stream
- Live-simulated news feed from 40+ countries in their native languages
- Per-article sentiment scoring and visual indicators
- Category filtering (Economy, Technology, Geopolitics, Energy, Climate)
- Reporter neutrality score at a glance

### 🔮 Dynamic Narrative Clustering
- AI groups articles from ~40 countries by semantic similarity — not just East/West blocks
- Each cluster shows sentiment, divergence score, and contributing nations
- High-divergence clusters (propaganda/geopolitical tension) are flagged with alerts
- Interactive cluster cards with detailed analysis panel

### 📊 Bias Tracker
- Per-reporter neutrality scores (0–100) learned from historical article analysis
- Bias direction (left/right/neutral) and trend (improving/declining/stable)
- Global coverage with flag-based country attribution

### 💰 AI Investment Signals (Edge)
- Actionable buy/sell/hold signals for stocks, crypto, commodities, and forex
- Confidence score and price target with upside calculation
- Reasoning tied directly to narrative clusters and information asymmetry
- Risk level classification per signal

### 📈 Sentiment Analytics
- Time-series area chart tracking positive/negative/neutral sentiment over trading hours
- Radar chart showing cluster sentiment vs. divergence matrix

### ⚡ Live Market Ticker
- Real-time scrolling ticker bar with live price simulation
- Covers indices (SPX, NDX, DAX, N225), crypto (BTC, ETH), commodities (Gold, Oil), forex pairs, and key stocks

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization (AreaChart, RadarChart)
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
