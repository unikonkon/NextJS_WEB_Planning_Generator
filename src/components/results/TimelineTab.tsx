'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckSquare, Package } from 'lucide-react';
import type { TimelineMilestone } from '@/types';

interface TimelineTabProps {
  timeline: TimelineMilestone;
  lang: 'en' | 'th';
}

const phaseColors = [
  { bg: 'bg-blue-500', light: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { bg: 'bg-green-500', light: 'bg-green-500/10', border: 'border-green-500/30' },
  { bg: 'bg-purple-500', light: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { bg: 'bg-orange-500', light: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { bg: 'bg-pink-500', light: 'bg-pink-500/10', border: 'border-pink-500/30' },
];

export function TimelineTab({ timeline, lang }: TimelineTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'ไทม์ไลน์และ Milestones' : 'Timeline & Milestones'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'แผนการดำเนินงานแบ่งตามระยะ'
            : 'Project execution plan by phases'}
        </p>
        <Badge variant="secondary" className="text-base px-4 py-1">
          <Clock className="w-4 h-4 mr-2" />
          {lang === 'th' ? 'รวมทั้งหมด' : 'Total'}: {timeline.totalDuration}
        </Badge>
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />

        <div className="space-y-8">
          {timeline.phases.map((phase, index) => {
            const color = phaseColors[index % phaseColors.length];
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative">
                {/* Connector dot */}
                <div 
                  className={`absolute left-6 w-4 h-4 rounded-full ${color.bg} border-4 border-background z-10 md:left-1/2 md:-translate-x-2`}
                  style={{ top: '1.5rem' }}
                />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <Card className={`border-2 ${color.border}`}>
                    <CardHeader className={`pb-3 ${color.light}`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-base">{phase.name}</CardTitle>
                        <Badge className={color.bg}>{phase.duration}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Tasks */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <CheckSquare className="w-4 h-4 text-muted-foreground" />
                          {lang === 'th' ? 'งานที่ต้องทำ' : 'Tasks'}
                        </div>
                        <ul className="space-y-1 pl-6">
                          {phase.tasks.map((task, i) => (
                            <li key={i} className="text-sm text-muted-foreground list-disc">
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          {lang === 'th' ? 'ผลลัพธ์ที่ส่งมอบ' : 'Deliverables'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {phase.deliverables.map((deliverable, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

