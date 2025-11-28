# AI-Powered Website Planning Generator

A comprehensive Next.js 15 web application that generates project discovery documents and website flowcharts using Google's Gemini AI.

## 🎯 Overview

This application provides two main tools for website planning:

1. **Discovery & Planning Generator** (`/generate`) - สร้างเอกสาร Discovery และแผนโปรเจค
2. **Flowchart Generator** (`/flowchart`) - สร้าง Flowchart โครงสร้างเว็บไซต์

---

## ✨ Features

### 📋 Discovery & Planning Generator (`/generate`)

A 4-step wizard interface for generating comprehensive project planning documents.

**Wizard Steps:**
| Step | ชื่อ | รายละเอียด |
|------|------|------------|
| 1 | Website Type | เลือกประเภทเว็บไซต์ (E-commerce, Blog, Portfolio, SaaS, Landing Page) |
| 2 | Features | เลือก Features ที่ต้องการ พร้อม Smart Defaults |
| 3 | Details | กรอกรายละเอียดโปรเจค (ชื่อ, กลุ่มเป้าหมาย, งบประมาณ, ระยะเวลา) |
| 4 | Prompt | ตรวจสอบและแก้ไข AI Prompt ก่อนสร้าง |

**AI-Generated Documents:**
- ✅ Requirements Document (Business, Functional, Non-Functional)
- ✅ User Personas (Demographics & Pain Points)
- ✅ Competitor & SWOT Analysis
- ✅ MoSCoW Scope Prioritization
- ✅ Timeline & Milestones
- ✅ Budget Estimation with Breakdown
- ✅ Risk Assessment with Mitigation Strategies
- ✅ System Architecture Recommendations

**Features:**
- Auto-save draft to LocalStorage
- Save generation history to IndexedDB
- Custom prompt editing
- Raw AI response viewer for debugging
- Export to PDF / Word (.docx)
- Multi-language support (EN/TH)

---

### 🔀 Flowchart Generator (`/flowchart`)

A 4-step wizard for generating Mermaid flowchart diagrams.

**Wizard Steps:**
| Step | ชื่อ | รายละเอียด |
|------|------|------------|
| 1 | เลือกประเภทเว็บไซต์ | เลือกประเภทเว็บที่ต้องการสร้าง |
| 2 | Core Features | เลือก Features หลักที่จำเป็น |
| 3 | Advanced Features | เลือก Features เสริม |
| 4 | สรุปผล | ตรวจสอบรายละเอียดและสร้าง Flowchart |

**Flowchart Types:**
| Type | ชื่อ | รายละเอียด |
|------|------|------------|
| `feature-overview` | Feature Overview | ภาพรวมความสัมพันธ์ของ Features ทั้งหมด |
| `user-flow` | User Flow | การเดินทางของผู้ใช้ผ่านระบบ |
| `data-flow` | Data Flow | การไหลของข้อมูลในระบบ |
| `page-structure` | Page Structure | โครงสร้าง Routes และหน้าเว็บ |

**Features:**
- Live Mermaid diagram preview
- Export to SVG / PNG
- Copy Mermaid code
- Save flowchart history to IndexedDB
- Download as JSON (feature summary)

---

### 🌐 Supported Website Types

| Type | ชื่อ | Core Features | Advanced Features |
|------|------|---------------|-------------------|
| `ecommerce` | E-Commerce | Product Catalog, Shopping Cart, Checkout, Authentication, Order Management, Inventory, Search, Wishlist, Reviews, Coupons | Multi-currency, Shipping Calculator, Notifications, Admin Dashboard, Recommendations |
| `blog` | Blog | Post Management, Categories/Tags, Rich Text Editor, Comments, Search, Author Profiles, Social Share, SEO, RSS, Reading Time | Newsletter, Related Posts, Table of Contents, Dark Mode, Progress Indicator |
| `portfolio` | Portfolio | Project Gallery, About Section, Skills, Contact Form, Resume Download, Image Gallery, Project Details, Social Links, Testimonials, Timeline | Case Studies, Blog Integration, Animations, Filtering, Dark Mode |
| `saas` | SaaS | Authentication, Billing/Subscription, Pricing, Dashboard, Team Management, RBAC, API, Analytics, Settings, Onboarding | Admin Panel, Audit Logs, Webhooks, Notifications, Help Center, Feature Flags, Multi-tenancy |
| `landing` | Landing Page | Hero, Features/Benefits, Social Proof, Pricing, FAQ, Contact Form, CTA, Responsive, SEO, Analytics | A/B Testing, Animations, Video Background, Countdown, Live Chat |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  /generate  │  │ /flowchart  │  │  /history   │             │
│  │   (Wizard)  │  │   (Wizard)  │  │   (List)    │             │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘             │
│         │                │                                      │
│         ▼                ▼                                      │
│  ┌─────────────────────────────────────┐                       │
│  │         State Management            │                       │
│  │    (useState + LocalStorage +       │                       │
│  │         IndexedDB)                  │                       │
│  └──────────────┬──────────────────────┘                       │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐     ┌──────────────────┐                 │
│  │  /api/generate   │     │  /api/flowchart  │                 │
│  │                  │     │                  │                 │
│  │  - buildPrompt() │     │  - buildPrompt() │                 │
│  │  - parseJSON()   │     │  - cleanMermaid()│                 │
│  │  - validation    │     │  - sanitize()    │                 │
│  └────────┬─────────┘     └────────┬─────────┘                 │
│           │                        │                            │
│           └────────────┬───────────┘                            │
│                        ▼                                        │
│           ┌─────────────────────────┐                          │
│           │    Gemini AI Client     │                          │
│           │    (lib/gemini.ts)      │                          │
│           └────────────┬────────────┘                          │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Google Gemini API                              │
│                   (External Service)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Planning document generation API
│   │   └── flowchart/
│   │       └── route.ts          # Flowchart generation API
│   ├── flowchart/
│   │   ├── page.tsx              # Flowchart wizard page
│   │   ├── WebsiteType.ts        # Feature definitions (1800+ lines)
│   │   └── history/
│   │       └── page.tsx          # Flowchart history page
│   ├── generate/
│   │   └── page.tsx              # Planning wizard page
│   ├── history/
│   │   └── page.tsx              # Generation history page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── wizard/                   # Wizard step components
│   │   ├── StepOne.tsx           # Website type selection
│   │   ├── StepTwo.tsx           # Feature selection
│   │   ├── StepThree.tsx         # Project details
│   │   ├── StepFour.tsx          # Prompt preview/edit
│   │   ├── WizardProgress.tsx    # Progress indicator
│   │   └── index.ts
│   ├── results/                  # Results display components
│   │   ├── ResultsDisplay.tsx    # Main results container
│   │   ├── RequirementsTab.tsx   # Requirements section
│   │   ├── PersonasTab.tsx       # User personas section
│   │   ├── CompetitorTab.tsx     # Competitor analysis
│   │   ├── ScopeTab.tsx          # MoSCoW scope
│   │   ├── TimelineTab.tsx       # Timeline & milestones
│   │   ├── BudgetTab.tsx         # Budget estimation
│   │   ├── RiskTab.tsx           # Risk assessment
│   │   ├── SystemArchitectureTab.tsx
│   │   └── index.ts
│   ├── flowchart/                # Flowchart components
│   │   ├── FlowchartViewer.tsx   # Mermaid diagram viewer
│   │   ├── FlowchartHistoryCard.tsx
│   │   ├── FlowchartHistoryList.tsx
│   │   └── index.ts
│   ├── export/
│   │   ├── ExportButtons.tsx     # PDF/Word export buttons
│   │   └── index.ts
│   ├── ui/                       # shadcn/ui components
│   ├── ThemeProvider.tsx         # Dark/Light theme provider
│   ├── ThemeToggle.tsx           # Theme toggle button
│   └── DeleteConfirmationDialog.tsx
├── lib/
│   ├── gemini.ts                 # Gemini AI client & helpers
│   ├── prompt-builder.ts         # Planning prompt construction
│   ├── flowchart-prompt.ts       # Flowchart prompt construction
│   ├── storage.ts                # LocalStorage helpers
│   ├── indexeddb.ts              # IndexedDB for history
│   ├── export-pdf.ts             # PDF generation (jsPDF)
│   ├── export-word.ts            # Word generation (docx)
│   ├── scope-utils.ts            # Scope calculation utilities
│   └── utils.ts                  # General utilities
├── types/
│   └── index.ts                  # TypeScript interfaces
└── data/
    └── constants.ts              # Website types & features constants
```

---

## 🔌 API Reference

### POST `/api/generate`

Generate a comprehensive planning document.

**Request Body:**
```json
{
  "projectDetails": {
    "websiteType": "ecommerce",
    "selectedFeatures": ["auth", "payment", "cart"],
    "projectName": "My Store",
    "targetAudience": "Young adults",
    "budgetRange": "50000-100000",
    "timeline": "3-6 months",
    "additionalRequirements": "...",
    "outputLanguage": "th"
  },
  "customPrompt": "..." // Optional: override default prompt
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "requirements": {...},
    "personas": [...],
    "competitors": {...},
    "scope": {...},
    "timeline": {...},
    "budget": {...},
    "risks": [...],
    "systemArchitecture": {...}
  },
  "rawResponse": "...",
  "usedPrompt": "..."
}
```

---

### POST `/api/flowchart`

Generate a Mermaid flowchart diagram.

**Request Body:**
```json
{
  "websiteType": "ecommerce",
  "selectedFeatures": ["core:productCatalog", "core:shoppingCart", "advanced:adminDashboard"],
  "flowchartType": "feature-overview",
  "language": "th"
}
```

**Response:**
```json
{
  "success": true,
  "mermaidCode": "flowchart TD\n    A[Start] --> B[Product Catalog]\n    ...",
  "data": {
    "title": "E-Commerce Feature Overview",
    "description": "...",
    "mermaidCode": "..."
  }
}
```

**Flowchart Types:**
- `feature-overview` - ภาพรวม Features ทั้งหมด
- `user-flow` - User Journey Flow
- `data-flow` - Data Flow Diagram
- `page-structure` - Page/Route Structure

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui |
| **AI** | Google Gemini API |
| **Diagrams** | Mermaid.js |
| **Icons** | Lucide React |
| **PDF Export** | jsPDF + jspdf-autotable |
| **Word Export** | docx + file-saver |
| **Storage** | LocalStorage + IndexedDB |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NextJS_WEB_Planning_Generator
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

---

## 📖 Usage Guide

### Discovery & Planning Generator

1. **เลือกประเภทเว็บไซต์** - เลือกจาก E-commerce, Blog, Portfolio, SaaS, หรือ Landing Page
2. **เลือก Features** - ระบบจะแนะนำ Features ที่เหมาะสม สามารถเพิ่ม/ลดได้
3. **กรอกรายละเอียด** - ชื่อโปรเจค, กลุ่มเป้าหมาย, งบประมาณ, ระยะเวลา
4. **ตรวจสอบ Prompt** - แก้ไข AI Prompt ได้ตามต้องการ
5. **สร้าง** - กดปุ่มสร้างและรอ AI สร้างเอกสาร (10-30 วินาที)
6. **Export** - ดาวน์โหลดเป็น PDF หรือ Word

### Flowchart Generator

1. **เลือกประเภทเว็บไซต์** - เลือกประเภทที่เหมาะสมกับโปรเจค
2. **เลือก Core Features** - Features หลักที่จำเป็น (แบ่งตาม Priority: Required, Recommended, Optional)
3. **เลือก Advanced Features** - Features เสริมที่ต้องการ
4. **สรุปและสร้าง** - เลือกประเภท Flowchart และกดสร้าง
5. **ดาวน์โหลด** - Export เป็น SVG, PNG หรือคัดลอก Mermaid Code

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ Yes |

---

## 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🗄️ Data Storage

| Storage | Purpose | Data |
|---------|---------|------|
| **LocalStorage** | Draft auto-save | Wizard form data (temporary) |
| **IndexedDB** | History | Generated plans, Flowcharts |

---

## 📝 License

MIT
