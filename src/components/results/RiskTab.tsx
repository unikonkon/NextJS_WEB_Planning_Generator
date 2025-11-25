'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Lightbulb, ArrowRight } from 'lucide-react';
import type { RiskAssessment, Risk } from '@/types';

interface RiskTabProps {
  risks: RiskAssessment;
  lang: 'en' | 'th';
}

const riskLevelColors = {
  low: { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-500/10' },
  medium: { bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-500/10' },
  high: { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/10' },
};

const riskLevelLabels = {
  low: { en: 'Low', th: 'ต่ำ' },
  medium: { en: 'Medium', th: 'กลาง' },
  high: { en: 'High', th: 'สูง' },
};

function getRiskScore(risk: Risk): number {
  const probScore = { low: 1, medium: 2, high: 3 };
  const impactScore = { low: 1, medium: 2, high: 3 };
  return probScore[risk.probability] * impactScore[risk.impact];
}

export function RiskTab({ risks, lang }: RiskTabProps) {
  // Sort risks by score (highest first)
  const sortedRisks = [...risks.risks].sort((a, b) => getRiskScore(b) - getRiskScore(a));
  const overallColor = riskLevelColors[risks.overallRiskLevel];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'การประเมินความเสี่ยง' : 'Risk Assessment'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'ความเสี่ยงที่อาจเกิดขึ้นและแผนรับมือ'
            : 'Potential risks and mitigation strategies'}
        </p>
      </div>

      {/* Overall Risk Level */}
      <Card className={`${overallColor.light} border-2`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <div className={`p-3 rounded-full ${overallColor.light}`}>
              <AlertTriangle className={`w-8 h-8 ${overallColor.text}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {lang === 'th' ? 'ระดับความเสี่ยงโดยรวม' : 'Overall Risk Level'}
              </p>
              <Badge className={`${overallColor.bg} text-lg px-4 py-1 mt-1`}>
                {riskLevelLabels[risks.overallRiskLevel][lang]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Matrix */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-5 h-5" />
            {lang === 'th' ? 'เมทริกซ์ความเสี่ยง' : 'Risk Matrix'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium w-1/4">
                    {lang === 'th' ? 'ความเสี่ยง' : 'Risk'}
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'ความน่าจะเป็น' : 'Probability'}
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'ผลกระทบ' : 'Impact'}
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'คะแนน' : 'Score'}
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'หมวดหมู่' : 'Category'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRisks.map((risk, index) => {
                  const score = getRiskScore(risk);
                  const scoreLevel = score >= 6 ? 'high' : score >= 3 ? 'medium' : 'low';
                  const scoreColor = riskLevelColors[scoreLevel];

                  return (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-2 font-medium text-sm">{risk.name}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={riskLevelColors[risk.probability].bg}>
                          {riskLevelLabels[risk.probability][lang]}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={riskLevelColors[risk.impact].bg}>
                          {riskLevelLabels[risk.impact][lang]}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`font-bold ${scoreColor.text}`}>{score}</span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{risk.category}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {sortedRisks.map((risk, index) => {
          const score = getRiskScore(risk);
          const scoreLevel = score >= 6 ? 'high' : score >= 3 ? 'medium' : 'low';
          const scoreColor = riskLevelColors[scoreLevel];

          return (
            <Card key={index} className={`border-l-4 ${scoreColor.bg.replace('bg-', 'border-')}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{risk.name}</CardTitle>
                  <Badge variant="outline" className={scoreColor.text}>
                    {risk.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{risk.description}</p>
                
                <div className={`p-3 rounded-lg ${scoreColor.light}`}>
                  <div className="flex items-start gap-2">
                    <ArrowRight className={`w-4 h-4 mt-0.5 ${scoreColor.text}`} />
                    <div>
                      <p className="text-xs font-medium mb-1">
                        {lang === 'th' ? 'แผนรับมือ' : 'Mitigation'}
                      </p>
                      <p className="text-sm">{risk.mitigation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      {risks.recommendations && risks.recommendations.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-5 h-5 text-primary" />
              {lang === 'th' ? 'คำแนะนำ' : 'Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {risks.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

