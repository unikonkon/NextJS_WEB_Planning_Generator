'use client';

import { 
  ShoppingCart, 
  FileText, 
  Briefcase, 
  Cloud, 
  FileBox,
  type LucideIcon 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WEBSITE_TYPES, getDefaultFeaturesForType } from '@/data/constants';
import type { WebsiteTypeId } from '@/types';

const ICONS: Record<string, LucideIcon> = {
  ShoppingCart,
  FileText,
  Briefcase,
  Cloud,
  FileBox,
};

interface StepOneProps {
  selectedType: WebsiteTypeId | null;
  onSelectType: (typeId: WebsiteTypeId, defaultFeatures: string[]) => void;
  lang: 'en' | 'th';
}

export function StepOne({ selectedType, onSelectType, lang }: StepOneProps) {
  const handleSelect = (typeId: WebsiteTypeId) => {
    const defaultFeatures = getDefaultFeaturesForType(typeId);
    onSelectType(typeId, defaultFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {lang === 'th' ? 'เลือกประเภทเว็บไซต์' : 'Select Website Type'}
        </h2>
        <p className="text-muted-foreground">
          {lang === 'th' 
            ? 'เลือกประเภทโปรเจคที่ต้องการพัฒนา ระบบจะแนะนำฟีเจอร์ที่เหมาะสม' 
            : 'Choose your project type. We\'ll recommend suitable features.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WEBSITE_TYPES.map((type) => {
          const Icon = ICONS[type.icon] || FileBox;
          const isSelected = selectedType === type.id;

          return (
            <Card
              key={type.id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md group',
                isSelected && 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
              )}
              onClick={() => handleSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
                    'bg-gradient-to-br from-primary/10 to-primary/5',
                    'group-hover:from-primary/20 group-hover:to-primary/10',
                    isSelected && 'from-primary/30 to-primary/20'
                  )}
                >
                  <Icon 
                    className={cn(
                      'w-8 h-8 transition-colors',
                      isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    )} 
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    {lang === 'th' ? type.nameTh : type.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lang === 'th' ? type.descriptionTh : type.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <div className="text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
          {lang === 'th' 
            ? `✓ เลือก ${WEBSITE_TYPES.find(t => t.id === selectedType)?.nameTh} แล้ว - กดถัดไปเพื่อเลือกฟีเจอร์`
            : `✓ ${WEBSITE_TYPES.find(t => t.id === selectedType)?.name} selected - Click Next to choose features`}
        </div>
      )}
    </div>
  );
}

