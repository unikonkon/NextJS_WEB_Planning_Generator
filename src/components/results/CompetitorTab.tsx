'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, Shield, Zap, ExternalLink } from 'lucide-react';
import type { CompetitorAnalysis } from '@/types';

interface CompetitorTabProps {
  analysis: CompetitorAnalysis;
  lang: 'en' | 'th';
}

export function CompetitorTab({ analysis, lang }: CompetitorTabProps) {
  const swotItems = [
    {
      key: 'strengths',
      title: lang === 'th' ? 'จุดแข็ง (Strengths)' : 'Strengths',
      items: analysis.swot.strengths,
      icon: ThumbsUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      key: 'weaknesses',
      title: lang === 'th' ? 'จุดอ่อน (Weaknesses)' : 'Weaknesses',
      items: analysis.swot.weaknesses,
      icon: ThumbsDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      key: 'opportunities',
      title: lang === 'th' ? 'โอกาส (Opportunities)' : 'Opportunities',
      items: analysis.swot.opportunities,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      key: 'threats',
      title: lang === 'th' ? 'ภัยคุกคาม (Threats)' : 'Threats',
      items: analysis.swot.threats,
      icon: TrendingDown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* SWOT Analysis */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">
            {lang === 'th' ? 'วิเคราะห์ SWOT' : 'SWOT Analysis'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {lang === 'th'
              ? 'การวิเคราะห์จุดแข็ง จุดอ่อน โอกาส และภัยคุกคาม'
              : 'Analysis of Strengths, Weaknesses, Opportunities, and Threats'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {swotItems.map(({ key, title, items, icon: Icon, color, bgColor, borderColor }) => (
            <Card key={key} className={`border-2 ${borderColor}`}>
              <CardHeader className={`pb-3 ${bgColor}`}>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className={`w-5 h-5 ${color}`} />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${bgColor.replace('/10', '')}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Competitors */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">
            {lang === 'th' ? 'คู่แข่งในตลาด' : 'Market Competitors'}
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {analysis.competitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{competitor.name}</CardTitle>
                  {competitor.url && (
                    <a
                      href={competitor.url.startsWith('http') ? competitor.url : `https://${competitor.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{competitor.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <Shield className="w-3 h-3" />
                    {lang === 'th' ? 'จุดแข็ง' : 'Strengths'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.strengths.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-green-500/10">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                    <Zap className="w-3 h-3" />
                    {lang === 'th' ? 'จุดอ่อน' : 'Weaknesses'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.weaknesses.map((w, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-red-500/10">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

