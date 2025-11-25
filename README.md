# AI-Powered Discovery & Planning Generator

A Next.js 15 web application that generates comprehensive project discovery and planning documents using Google's Gemini AI.

## Features

- **3-Step Wizard Interface**
  - Step 1: Select website type (E-commerce, Blog, Portfolio, SaaS, Landing Page)
  - Step 2: Choose features with smart defaults based on project type
  - Step 3: Add project details (target audience, budget, timeline, etc.)

- **AI-Generated Planning Documents**
  - Requirements Document (Business, Functional, Non-Functional)
  - User Personas with demographics and pain points
  - Competitor & SWOT Analysis
  - MoSCoW Scope Prioritization
  - Timeline & Milestones
  - Budget Estimation with breakdown
  - Risk Assessment with mitigation strategies

- **Export Options**
  - Export to PDF
  - Export to Word (.docx)
  - Save to LocalStorage
  - Regenerate functionality

- **Multi-Language Support**
  - UI available in English and Thai
  - Generated content can be in English or Thai

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **PDF Export**: jsPDF + jspdf-autotable
- **Word Export**: docx + file-saver

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key

### Installation

1. Clone the repository:
```bash
cd discovery-generator
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

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts  # Gemini API endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main wizard page
│   └── globals.css            # Global styles
├── components/
│   ├── wizard/                # Wizard step components
│   │   ├── StepOne.tsx
│   │   ├── StepTwo.tsx
│   │   ├── StepThree.tsx
│   │   └── WizardProgress.tsx
│   ├── results/               # Results display components
│   │   ├── ResultsDisplay.tsx
│   │   ├── RequirementsTab.tsx
│   │   ├── PersonasTab.tsx
│   │   ├── CompetitorTab.tsx
│   │   ├── ScopeTab.tsx
│   │   ├── TimelineTab.tsx
│   │   ├── BudgetTab.tsx
│   │   └── RiskTab.tsx
│   ├── export/
│   │   └── ExportButtons.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── gemini.ts              # Gemini API client
│   ├── prompt-builder.ts      # Dynamic prompt construction
│   ├── storage.ts             # LocalStorage helpers
│   ├── export-pdf.ts          # PDF generation
│   ├── export-word.ts         # Word generation
│   └── utils.ts               # Utility functions
├── types/
│   └── index.ts               # TypeScript interfaces
└── data/
    └── constants.ts           # Website types & features data
```

## Usage

1. **Select Website Type**: Choose from E-commerce, Blog, Portfolio, SaaS, or Landing Page. The system will automatically suggest recommended features.

2. **Customize Features**: Add or remove features based on your project needs. Features are categorized into Authentication, Payment, Communication, Admin, Analytics, and UX/UI.

3. **Add Details**: Fill in project name, target audience, budget range, timeline, and any additional requirements. Choose the output language for the generated document.

4. **Generate**: Click "Generate Discovery & Planning" to create your comprehensive project document.

5. **Export**: Download your plan as PDF or Word document, or save it locally for later reference.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API Key | Yes |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
