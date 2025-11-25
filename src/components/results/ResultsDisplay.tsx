'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Users,
  Target,
  ListChecks,
  Network,
  Calendar,
  Wallet,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { RequirementsTab } from './RequirementsTab';
import { PersonasTab } from './PersonasTab';
import { CompetitorTab } from './CompetitorTab';
import { ScopeTab } from './ScopeTab';
import { SystemArchitectureTab } from './SystemArchitectureTab';
import { TimelineTab } from './TimelineTab';
import { BudgetTab } from './BudgetTab';
import { RiskTab } from './RiskTab';
import type { GeneratedPlan } from '@/types';

interface ResultsDisplayProps {
  plan: GeneratedPlan;
  lang: 'en' | 'th';
}

const tabs = [
  { id: 'requirements', icon: FileText, labelEn: 'Requirements', labelTh: 'ความต้องการ' },
  { id: 'personas', icon: Users, labelEn: 'Personas', labelTh: 'กลุ่มผู้ใช้' },
  { id: 'competitors', icon: Target, labelEn: 'Competitors', labelTh: 'คู่แข่ง' },
  { id: 'scope', icon: ListChecks, labelEn: 'Scope', labelTh: 'ขอบเขต' },
  { id: 'architecture', icon: Network, labelEn: 'Architecture', labelTh: 'สถาปัตยกรรม' },
  { id: 'timeline', icon: Calendar, labelEn: 'Timeline', labelTh: 'ไทม์ไลน์' },
  { id: 'budget', icon: Wallet, labelEn: 'Budget', labelTh: 'งบประมาณ' },
  { id: 'risks', icon: AlertTriangle, labelEn: 'Risks', labelTh: 'ความเสี่ยง' },
];

export function ResultsDisplay({ plan, lang }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{plan.projectName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {lang === 'th' ? 'สร้างเมื่อ' : 'Generated on'}{' '}
                {new Date(plan.generatedAt).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {lang === 'th' ? tab.labelTh : tab.labelEn}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-6">

          <TabsContent value="architecture" className="m-0">
            <SystemArchitectureTab architecture={plan.systemArchitecture} lang={lang} />
          </TabsContent>

          <TabsContent value="requirements" className="m-0">
            <RequirementsTab requirements={plan.requirements} lang={lang} />
          </TabsContent>

          <TabsContent value="personas" className="m-0">
            <PersonasTab personas={plan.personas} lang={lang} />
          </TabsContent>

          <TabsContent value="competitors" className="m-0">
            <CompetitorTab analysis={plan.competitorAnalysis} lang={lang} />
          </TabsContent>

          <TabsContent value="scope" className="m-0">
            <ScopeTab scope={plan.scope} lang={lang} />
          </TabsContent>

          <TabsContent value="timeline" className="m-0">
            <TimelineTab timeline={plan.timeline} lang={lang} />
          </TabsContent>

          <TabsContent value="budget" className="m-0">
            <BudgetTab budget={plan.budget} lang={lang} />
          </TabsContent>

          <TabsContent value="risks" className="m-0">
            <RiskTab risks={plan.risks} lang={lang} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

