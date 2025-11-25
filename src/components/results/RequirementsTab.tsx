'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Briefcase, Cog, Shield } from 'lucide-react';
import type { RequirementsDocument } from '@/types';

interface RequirementsTabProps {
  requirements: RequirementsDocument;
  lang: 'en' | 'th';
}

export function RequirementsTab({ requirements, lang }: RequirementsTabProps) {
  const sections = [
    {
      key: 'business',
      data: requirements.business,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      key: 'functional',
      data: requirements.functional,
      icon: Cog,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      key: 'nonFunctional',
      data: requirements.nonFunctional,
      icon: Shield,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'เอกสารความต้องการ' : 'Requirements Document'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'ความต้องการทั้งหมดที่จำเป็นสำหรับโปรเจคนี้'
            : 'All requirements necessary for this project'}
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map(({ key, data, icon: Icon, color, bgColor }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{data.title}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {data.items.length} {lang === 'th' ? 'รายการ' : 'items'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

