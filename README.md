<div align="center">

<img src="docs/banner.png" alt="FlowMatch Banner" width="100%" />

<br />
<br />

**Find the perfect automation workflow in seconds.**

Search, discover, compare and deploy from over 5,000 curated n8n workflow templates.

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

[![Workflows](https://img.shields.io/badge/Workflows-5%2C123-8b5cf6)](https://flowmatch.progvision.in/workflows)
[![Integrations](https://img.shields.io/badge/Integrations-301-f97316)](https://flowmatch.progvision.in/integrations)
[![Categories](https://img.shields.io/badge/Categories-36-0ea5e9)](https://flowmatch.progvision.in/categories)
[![Quality Checked](https://img.shields.io/badge/Quality%20Checked-3%2C376-10b981)](https://flowmatch.progvision.in/workflows)

<br />

[Live Demo](https://flowmatch.progvision.in) · [Report Bug](https://github.com/ganeshkrishnareddy/FlowMatch/issues) · [Request Feature](https://github.com/ganeshkrishnareddy/FlowMatch/issues)

</div>

---

## About

FlowMatch is an open-source automation workflow search engine that indexes, curates, and serves over **5,000 production-ready n8n workflow templates**. It combines AI-powered matching, automated security scanning, quality scoring, and duplicate detection to help automation builders find the right workflow in seconds — not hours.

Every workflow is parsed, normalized, security-scanned, and enriched with human-readable instructions before it appears in the directory.

## Features

| Category | Feature |
|---|---|
| 🔍 **Search** | Full-text search across 5,000+ workflows by name, description, integration, or category |
| 🤖 **AI Match** | Natural language query engine — describe what you need, get matched workflows |
| 📊 **Workflow Visualization** | Interactive node graph powered by React Flow with animated connectors |
| 🛡️ **Security Scanning** | Automated detection of exposed secrets, suspicious commands, and common risks |
| 🔄 **Duplicate Detection** | Identifies identical and highly similar workflows to keep results clean |
| 📝 **Auto Instructions** | Human-readable setup guides generated for every workflow |
| 📦 **One-Click Export** | Download production-ready n8n JSON with embedded setup instructions as sticky notes |
| 🏷️ **36 Categories** | Browse workflows organized by business domain and use case |
| 🔌 **301+ Integrations** | Filter by specific apps: Slack, Gmail, Notion, Shopify, HubSpot, OpenAI, and more |
| 📚 **Curated Collections** | Hand-picked workflow bundles for common business scenarios |
| 🌓 **Dark & Light Mode** | Full theme support with dark mode as default |
| 📱 **Responsive Design** | Optimized for desktop, tablet, and mobile viewports |
| ⚡ **Fast Performance** | Code-split lazy loading, optimized bundles under 500KB gzipped |
| 🧪 **Quality Scoring** | Every workflow scored on structure, completeness, and configuration quality |
| 🏗️ **Original Templates** | 2,000+ FlowMatch-authored workflows alongside indexed community templates |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                       │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│  Search  │ AI Match │ Workflow │ Category │  Integration   │
│  Engine  │  Engine  │ Explorer │ Browser  │   Explorer     │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│                    Service Layer                            │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│ Workflow │ Security │ Quality  │ Category │  Instruction   │
│  Parser  │ Scanner  │  Scorer  │Normalizer│  Generator     │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│                  Data Repository Layer                      │
├─────────────────────────┬──────────────────────────────────┤
│   JSON Chunk Storage    │       Supabase (Postgres)        │
│  (5,000+ workflows)    │     (metadata + analytics)       │
└─────────────────────────┴──────────────────────────────────┘
```

## Platform Statistics

| Metric | Count |
|---|---|
| 📊 Total Workflows | **5,123** |
| 🔌 Integrations | **301** |
| 📁 Categories | **36** |
| ✅ Quality Checked | **3,376** |
| 🏗️ Original Templates | **2,000+** |
| 📥 Indexed Templates | **3,100+** |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 8 |
| **Styling** | TailwindCSS 4, Custom design system |
| **State** | React hooks, lazy loading, code splitting |
| **Visualization** | React Flow (interactive workflow graphs) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Data** | Chunked JSON with pre-built search indices |
| **AI** | OpenAI embeddings for semantic workflow matching |
| **Hosting** | Cloudflare Pages |

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/ganeshkrishnareddy/FlowMatch.git

# Navigate to project directory
cd FlowMatch

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_URL=https://flowmatch.progvision.in
```

## Project Structure

```
FlowMatch/
├── public/
│   └── data/
│       └── indexed-workflows/     # 5,000+ workflow JSON chunks
│           ├── chunks/            # Paginated workflow batches
│           ├── details/           # Individual workflow files
│           └── index.json         # Master index with categories & integrations
├── src/
│   ├── components/
│   │   ├── brand/                 # Platform logo SVGs
│   │   ├── common/                # Shared UI components
│   │   ├── layout/                # Navbar, Footer, AppShell
│   │   └── workflow/              # WorkflowCard, WorkflowGraph, badges
│   ├── pages/                     # Route-level page components
│   ├── services/
│   │   ├── workflowParser.ts      # n8n JSON → structured data
│   │   ├── workflowNormalizer.ts  # Display name normalization
│   │   ├── securityScanner.ts     # Automated security checks
│   │   ├── workflowQualityScorer.ts # Quality score computation
│   │   ├── categoryNormalizer.ts  # Category classification
│   │   ├── instructionGenerator.ts # Setup guide generation
│   │   ├── stickyNoteInjector.ts  # n8n sticky note instructions
│   │   └── workflowGraphLayout.ts # Topological graph layout engine
│   ├── repositories/              # Data access layer
│   ├── types/                     # TypeScript type definitions
│   └── config/                    # App configuration
├── scripts/                       # Build & generation scripts
├── reports/                       # Quality & security reports
├── docs/                          # Documentation & assets
└── supabase/                      # Database migrations
```

## Workflow Processing Pipeline

Every workflow goes through a multi-stage processing pipeline before appearing in the directory:

```
Raw n8n JSON
    ↓
┌─────────────┐
│   Parser    │  Extract nodes, connections, metadata
└──────┬──────┘
       ↓
┌─────────────┐
│ Normalizer  │  Clean display titles, descriptions
└──────┬──────┘
       ↓
┌─────────────┐
│  Security   │  Scan for secrets, suspicious patterns
│   Scanner   │
└──────┬──────┘
       ↓
┌─────────────┐
│  Quality    │  Score structure, completeness, config
│   Scorer    │
└──────┬──────┘
       ↓
┌─────────────┐
│ Instruction │  Generate human-readable setup guides
│  Generator  │
└──────┬──────┘
       ↓
┌─────────────┐
│  Category   │  Classify into 36 business categories
│ Normalizer  │
└──────┬──────┘
       ↓
  Ready for Search
```

## Roadmap

- [x] 5,000+ curated workflows
- [x] AI-powered semantic matching
- [x] Automated security scanning
- [x] Quality scoring system
- [x] Duplicate detection
- [x] 36 business categories
- [x] 301+ integration filters
- [x] Interactive workflow visualization
- [x] Auto-generated setup instructions
- [x] Dark mode (default)
- [x] Responsive mobile design
- [x] n8n alternatives comparison guide
- [ ] AI Workflow Builder — generate custom workflows from descriptions
- [ ] Workflow Versioning — track template changes over time
- [ ] Community Collections — user-curated workflow bundles
- [ ] User Ratings & Reviews
- [ ] Workflow Comments & Discussions
- [ ] Public REST API
- [ ] Webhook testing sandbox
- [ ] Multi-platform export (Make, Zapier, Pipedream)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push to the branch
git push origin feature/your-feature

# Open a Pull Request
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [n8n](https://n8n.io) — The workflow automation platform
- [React Flow](https://reactflow.dev) — Interactive node graph library
- [Supabase](https://supabase.com) — Open-source Firebase alternative
- [Vite](https://vite.dev) — Next-generation frontend tooling
- [TailwindCSS](https://tailwindcss.com) — Utility-first CSS framework
- [Lucide](https://lucide.dev) — Icon library

---

<div align="center">

Built with ❤️ by [ProgVision](https://github.com/ganeshkrishnareddy)

If this project helped you, consider giving it a ⭐

</div>
