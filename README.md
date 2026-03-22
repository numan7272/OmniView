# OmniView AI

Global news analysis engine that breaks through filter bubbles. Aggregates real-time news from 40+ countries via GDELT, uses Claude AI to detect narrative clusters, reporter bias, and investment signals.

## Features

- **Live News Feed** -- Real-time articles from GDELT (no API key needed), clickable links to original sources
- **Narrative Clustering** -- AI groups articles by semantic similarity across countries, not fixed geopolitical blocks
- **Reporter Bias Tracking** -- Neutrality scoring (0-100) based on language, framing, and sourcing patterns
- **Investment Signals** -- BUY / SELL / WATCH recommendations with confidence levels based on information asymmetries
- **AI Chat** -- Conversational analysis with article attachment. Compare coverage across countries for neutrality
- **Watchlist** -- Track topics you care about for ongoing monitoring

## Setup

```bash
# Install dependencies
npm install

# Configure API key
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Requirements

- Node.js 18+
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/))

News data comes from GDELT (free, no key required). AI analysis and chat require the Anthropic API key.

## Tech Stack

- Next.js 16 + React 19
- Tailwind CSS 4
- Recharts
- Anthropic Claude API (`@anthropic-ai/sdk`)
- shadcn/ui components
- GDELT API for real-time global news

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/    # Claude-powered narrative + bias + signal analysis
│   │   ├── chat/       # Conversational AI with article context
│   │   ├── news/       # GDELT news aggregation
│   │   └── signals/    # Real-time signal generation
│   ├── layout.tsx
│   └── page.tsx        # Main dashboard
├── components/
│   ├── chat/           # AI chat with article attachment
│   ├── watchlist/      # Topic monitoring
│   ├── dashboard/      # News feed, clusters, article cards
│   ├── signals/        # Investment signal display
│   ├── bias/           # Reporter bias tracking + charts
│   └── layout/         # Sidebar, header
├── hooks/              # Data fetching hooks
└── lib/
    ├── anthropic.ts    # Claude API client
    ├── gdelt.ts        # GDELT news fetcher
    ├── types.ts        # TypeScript interfaces
    └── countries.ts    # 44 country definitions
```
