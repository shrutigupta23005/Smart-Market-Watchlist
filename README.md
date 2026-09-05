# 📡 SIGNAL
### *A watchlist that remembers what you saw and tells you what actually changed.*

> **"SIGNAL does not answer 'what is happening now.' It answers 'what changed since I last looked, and does it deserve my attention.'"**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-cyan?style=for-the-badge&logo=github)](https://shrutigupta23005.github.io/Smart-Market-Watchlist/)

---

## 🧭 Product Philosophy & The Attention Manifesto

Traditional financial watchlists are designed like slot machines: endless blinking green and red numbers, flashing tickers, and noisy feeds fighting for your dopamine. 

**SIGNAL is built on an entirely different premise:**
* **Attention is the scarce resource being protected**, not screen space.
* **Hard Rule: No buy/sell advice, no predictions, no black-box "AI recommendation" language.** Every score is 100% deterministic and explainable with plain-English reasons.
* **Silence is a first-class feature, not an empty state.** When markets are quiet or moving within normal noise, SIGNAL tells you with confidence that nothing happened, saving you cognitive load.
* **Gets quieter over time.** As the platform learns which signals you find useful versus noise through explicit feedback, its alert threshold personalizes to respect your focus.
* **Session-diff over clock-diff.** Markets don't reset when your clock strikes 9:00 AM. SIGNAL computes changes relative to the exact moment **you** last engaged.

---

## 🏛️ Architecture Overview

```
                      +---------------------------------------+
                      |       INDIAN EQUITY DATA FEED         |
                      |   (RELIANCE, TCS, INFY, HDFC, etc.)   |
                      +-------------------+-------------------+
                                          |
                                 10-sec Polling Worker
                                          v
                      +---------------------------------------+
                      |         PriceTick Ingestion           |
                      |   (Price, Volatility, Sector Delta)   |
                      +-------------------+-------------------+
                                          |
                                          v
+------------------+         +----------------------------+
| Session Snapshot | ------> |       SIGNAL ENGINE        | <------ Rolling Baselines
| (What you saw)   |         |  - Change Detector         |         (20-period stats)
+------------------+         |  - Relative Z-Score Math   |
                             |  - Sector Echo Correlator  |
                             |  - Personalization Engine  |
                             +--------------+-------------+
                                            |
                         +------------------+------------------+
                         |                                     |
                         v                                     v
             +-----------------------+             +-----------------------+
             |   Hero Away-Summary   |             | Market Replay Log     |
             | - Attention Score     |             | - Sparse Event Log    |
             | - Budget Bar          |             | - Chronological Scrub |
             | - Plain English Whys  |             | - Event Fingerprints  |
             +-----------------------+             +-----------------------+
```

---

## ✨ 18 Core Differentiators

| # | Differentiator | Description |
|---|---|---|
| 1 | **Session-Diff Computation** | Evaluates price, rank, and volatility changes against your personal last session snapshot, not arbitrary calendar windows. |
| 2 | **Explainable Attention Score (0–100)** | Transparent formula weighting relative magnitude, rank shift, sector divergence, and regime changes. |
| 3 | **"Nothing Happened" Confidence State** | When moves fall within normal historical noise, displays an intentional calm state confirming no action is required. |
| 4 | **Market Replay Timeline** | Interactive chronological scrubber to step through exact moments change events occurred while you were away. |
| 5 | **Sparse Event Logging** | Records events only when thresholds are breached, preventing database bloat and eliminating noise. |
| 6 | **Attention Budgeting** | Visual budget bar and max items cap prevents cognitive overload and information fatigue. |
| 7 | **Sector Echo & Divergence** | Identifies when an asset is moving in isolation vs co-moving with its industry sector and market index. |
| 8 | **Watchlist Rank Shifts** | Highlights dramatic internal priority re-orderings (e.g., stock moving from #5 to #1 in volatility). |
| 9 | **Trend Reversals** | Detects sharp directional flips between your previous session baseline and current status. |
| 10 | **Volatility Regime Shifts** | Detects shifts between low, medium, and high volatility regimes relative to 20-period trailing stats. |
| 11 | **Data Freshness Classification** | Clear badges classifying tick status: `LIVE` (<60s), `DELAYED` (60s–15m), `STALE` (≥15m) with confidence scores. |
| 12 | **Personalization Feedback Multiplier** | Thumbs up/down alert feedback dynamically adjusts individual sensitivity, making the system quieter over time. |
| 13 | **Attention Streak Counter** | Tracks consecutive days of focused, intentional market reviews without mindless scrolling. |
| 14 | **Watchlist Health Index** | Evaluates overall watchlist balance, coverage freshness, and volatility dispersion. |
| 15 | **Configurable Quiet Hours** | Schedule recurring daily time blocks where non-urgent signals are automatically suppressed. |
| 16 | **Muted Signals Management** | Temporarily mute specific tickers or categories while retaining background tracking. |
| 17 | **Estimated Review Time** | Calculates estimated seconds required to review the away-summary based on attention density. |
| 18 | **1-Click Demo Scenarios** | Built-in scenario seeder in the top bar to toggle between **Rich Signals** (volatile market) and **Silence** (nothing happened). |

---

## 🧮 Mathematical Engine & Attention Score Formula

The Attention Score $S \in [0, 100]$ for any asset is deterministically derived from:

$$S = \min\left(100, \left(W_{\text{mag}} \cdot M_{\text{rel}} + W_{\text{div}} \cdot D_{\text{sec}} + W_{\text{rev}} \cdot R_{\text{trend}} + W_{\text{vol}} \cdot V_{\text{regime}} + W_{\text{rank}} \cdot \Delta_{\text{rank}}\right) \times P_{\text{user}}\right)$$

* **Relative Magnitude ($M_{\text{rel}}$)**: Price change normalized by the stock's 20-period trailing standard deviation ($\frac{|\Delta P|}{\sigma}$).
* **Sector Divergence ($D_{\text{sec}}$)**: Absolute difference between stock return and its sector index benchmark.
* **Trend Reversal ($R_{\text{trend}}$)**: Binary flag (1 or 0) indicating sign flip in price velocity.
* **Volatility Regime ($V_{\text{regime}}$)**: Shift between Low ($\sigma < 1\%$), Normal ($1\% \le \sigma \le 2.5\%$), and High ($\sigma > 2.5\%$).
* **Personalization Multiplier ($P_{\text{user}}$)**: Decays toward zero when signals are marked unhelpful ($P \in [0.4, 1.3]$).

### Attention Buckets
* 🔴 **MUST_SEE** ($Score \ge 70$): Urgent divergence, large volatility breakout, or severe rank shift.
* 🟡 **WORTH_KNOWING** ($40 \le Score < 70$): Moderate trend continuation or sector co-movement.
* 🟢 **NO_ACTION** ($Score < 40$): Moves within baseline noise.

---

## 🛠️ Tech Stack

### **Frontend**
* **React 18** (Functional components, custom hooks)
* **Vite** (Ultra-fast build tooling and HMR)
* **Tailwind CSS v4** (Modern utility-first styling)
* **Lucide React** (Clean, minimalist iconography)
* **Axios** (HTTP client with JWT interceptors)

### **Backend**
* **Node.js & Express** (RESTful API microservice)
* **MongoDB & Mongoose** (Document storage for users, ticks, snapshots, events, benchmarks)
* **JWT & bcryptjs** (Secure stateless authentication & password hashing)
* **Node Test Runner** (Zero-dependency unit test suite)

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) running locally on port `27017` (or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/shrutigupta23005/Smart-Market-Watchlist.git
cd Smart-Market-Watchlist
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*The backend will boot on `http://localhost:5000` and automatically start the price ingestion engine.*

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The client will start on `http://localhost:3000` with automated proxying to the backend.*

---

## 🧪 Testing

Run the deterministic Signal Engine unit tests:
```bash
cd backend
npm test
```
Verifies:
1. High-attention divergent reversal events ($Score \ge 90$).
2. Quiet stock drift ($Score \le 5$, marked `NO_ACTION`).
3. Freshness degradation handling (`DELAYED`/`STALE`).
4. Personalization decay calculations.

---

## 🎬 Testing Demo Scenarios

Once logged in (use any email and password on the signup page), look at the top navigation bar for the **Demo Scenario** buttons:

1. **⚡ Seed Rich Signals**: Injects simulated market volatility across Tata Motors, Reliance, Infosys, and HDFC with divergent price spikes, sector decoupling, and trend reversals. You will immediately see:
   * Categorized `MUST_SEE` and `WORTH_KNOWING` cards
   * Plain-English reason tags
   * Market Replay timeline scrubber with recorded events
2. **🍃 Seed Silence ("Nothing Happened")**: Injects calm market conditions within normal noise thresholds. Demonstrates SIGNAL's primary philosophy:
   * Confident "Nothing Happened" status banner
   * Zero cognitive overload
   * Explicit confirmation that attention is preserved

---

## 📂 Project Structure

```
Smart-Market-Watchlist/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & env setup
│   │   ├── controllers/     # Auth, Watchlist, Summary, Replay, Insights, Demo
│   │   ├── jobs/            # Ingestion worker, attention decay, rolling stats
│   │   ├── middleware/      # JWT auth guard, token verification
│   │   ├── models/          # User, Watchlist, Snapshot, PriceTick, ChangeEvent, Benchmark
│   │   ├── routes/          # REST API route definitions
│   │   ├── services/        # SignalEngine, MarketDataProvider, ReplayService, Correlation
│   │   └── server.js        # Express app entry point
│   ├── test/                # Unit test suite for math and signal engine
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # SignalCard, MarketReplayTimeline, AttentionBudgetBar, etc.
│   │   ├── context/         # AuthContext & WatchlistContext
│   │   ├── hooks/           # usePolling hook for real-time freshness
│   │   ├── pages/           # Dashboard, WatchlistManager, Settings
│   │   ├── services/        # Axios API clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🚀 Deployment Options

### 1. GitHub Pages (Static / In-Browser Interactive Mode)
The frontend includes an intelligent simulation engine that runs 100% in-browser when opened on GitHub Pages:
- Live Demo: [https://shrutigupta23005.github.io/Smart-Market-Watchlist/](https://shrutigupta23005.github.io/Smart-Market-Watchlist/)
- Automated CI/CD: Handled by `.github/workflows/deploy.yml` on every push to `main`.
- Or deploy directly from the `gh-pages` branch.

### 2. Full-Stack on Render (Backend + Database + Frontend)
A production Blueprint [`render.yaml`](file:///C:/Users/Dell/signal/render.yaml) is included in the repository:
1. Fork or push to your GitHub account.
2. Log into [Render.com](https://render.com) and click **New + Blueprints**.
3. Select this repository. Render will automatically provision:
   - Node.js Web Service for the backend API.
   - Static Web App for the React frontend with automatic environment variable linking.

### 3. Vercel
Configuration is included in [`vercel.json`](file:///C:/Users/Dell/signal/vercel.json):
```bash
npm install -g vercel
vercel
```

### 4. Docker & Docker Compose
Run the entire production stack (MongoDB, Backend, Ingestion Worker) with a single command:
```bash
docker compose up --build
```

---

## 📜 License
MIT © 2026 Shruti Gupta. Built with focus for the modern trader.
