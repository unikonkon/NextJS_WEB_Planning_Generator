'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, CircleDot, XCircle } from 'lucide-react';
import type { MoSCoWScope } from '@/types';
import { isDetailedScopeItem } from '@/lib/scope-utils';

interface ScopeTabProps {
  scope: MoSCoWScope;
  lang: 'en' | 'th';
}

export function ScopeTab({ scope, lang }: ScopeTabProps) {
  const sections = [
    {
      key: 'mustHave',
      data: scope.mustHave,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      badgeColor: 'bg-green-500',
      label: lang === 'th' ? 'ต้องมี' : 'Must Have',
    },
    {
      key: 'shouldHave',
      data: scope.shouldHave,
      icon: CircleDot,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      badgeColor: 'bg-blue-500',
      label: lang === 'th' ? 'ควรมี' : 'Should Have',
    },
    {
      key: 'couldHave',
      data: scope.couldHave,
      icon: Circle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      badgeColor: 'bg-yellow-500',
      label: lang === 'th' ? 'อาจมี' : 'Could Have',
    },
    {
      key: 'wontHave',
      data: scope.wontHave,
      icon: XCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/30',
      badgeColor: 'bg-gray-500',
      label: lang === 'th' ? 'ไม่รวม' : "Won't Have",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'ขอบเขตโปรเจค (MoSCoW)' : 'Project Scope (MoSCoW)'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'การจัดลำดับความสำคัญของฟีเจอร์ตามหลัก MoSCoW'
            : 'Feature prioritization using MoSCoW method'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(({ key, data, icon: Icon, color, bgColor, borderColor, badgeColor, label }) => (
          <Card key={key} className={`border-2 ${borderColor}`}>
            <CardHeader className={`pb-3 ${bgColor}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className={`w-5 h-5 ${color}`} />
                  {data.title}
                </CardTitle>
                <Badge className={badgeColor}>
                  {data.items.length} {lang === 'th' ? 'รายการ' : 'items'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {data.items.map((item, index) => {
                  const detailed = isDetailedScopeItem(item);
                  const requirements = detailed && Array.isArray(item.requirements) ? item.requirements : [];

                  return (
                    <li key={index} className="text-sm">
                      <div className="flex items-start gap-3">
                        <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${badgeColor}`} />
                        {detailed ? (
                          <div className="space-y-1">
                            <p className="font-medium leading-5">{item.feature}</p>
                            {requirements.length > 0 && (
                              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                                {requirements.map((req, reqIndex) => (
                                  <li key={reqIndex}>{req}</li>
                                ))}
                              </ul>
                            )}
                            {!requirements.length && item.description && (
                              <p className="text-muted-foreground">{item.description}</p>
                            )}
                            {!requirements.length && !item.description && item.notes && (
                              <p className="text-muted-foreground">{item.notes}</p>
                            )}
                          </div>
                        ) : (
                          <span>{item}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {sections.map(({ label, badgeColor }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

