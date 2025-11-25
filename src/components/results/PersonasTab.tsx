'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, AlertCircle, Sparkles } from 'lucide-react';
import type { UserPersona } from '@/types';

interface PersonasTabProps {
  personas: UserPersona[];
  lang: 'en' | 'th';
}

export function PersonasTab({ personas, lang }: PersonasTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'กลุ่มผู้ใช้เป้าหมาย' : 'User Personas'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'โปรไฟล์ผู้ใช้หลักที่จะใช้งานระบบ'
            : 'Key user profiles who will use the system'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {personas.map((persona, index) => (
          <Card 
            key={index} 
            className={persona.isPrimary ? 'border-primary/50 bg-primary/5' : ''}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{persona.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{persona.name}</h4>
                      {persona.isPrimary && (
                        <Badge className="bg-primary">
                          {lang === 'th' ? 'หลัก' : 'Primary'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{persona.role}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Demographics */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{persona.age}</Badge>
                <Badge variant="outline">{persona.occupation}</Badge>
                <Badge variant="outline">
                  Tech: {persona.techSavviness}
                </Badge>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="w-4 h-4 text-green-500" />
                  {lang === 'th' ? 'เป้าหมาย' : 'Goals'}
                </div>
                <ul className="space-y-1 pl-6">
                  {persona.goals.map((goal, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pain Points */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {lang === 'th' ? 'ปัญหาที่พบ' : 'Pain Points'}
                </div>
                <ul className="space-y-1 pl-6">
                  {persona.painPoints.map((pain, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

