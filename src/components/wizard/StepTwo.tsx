'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FEATURES, FEATURE_CATEGORIES } from '@/data/constants';
import type { WebsiteTypeId } from '@/types';
import { cn } from '@/lib/utils';

interface StepTwoProps {
  websiteType: WebsiteTypeId | null;
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
  lang: 'en' | 'th';
}

export function StepTwo({ websiteType, selectedFeatures, onToggleFeature, lang }: StepTwoProps) {
  // Group features by category
  const featuresByCategory = FEATURE_CATEGORIES.map(category => ({
    ...category,
    features: FEATURES.filter(f => f.category === category.id),
  })).filter(cat => cat.features.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {lang === 'th' ? 'เลือกฟีเจอร์ที่ต้องการ' : 'Select Features'}
        </h2>
        <p className="text-muted-foreground">
          {lang === 'th'
            ? 'ฟีเจอร์ที่แนะนำถูกเลือกไว้แล้ว คุณสามารถเพิ่มหรือลดได้ตามต้องการ'
            : 'Recommended features are pre-selected. Customize as needed.'}
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Badge variant="secondary" className="gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {selectedFeatures.length} {lang === 'th' ? 'รายการที่เลือก' : 'selected'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuresByCategory.map(category => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="py-3 bg-muted/50">
              <CardTitle className="text-sm font-medium">
                {lang === 'th' ? category.nameTh : category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {category.features.map(feature => {
                const isSelected = selectedFeatures.includes(feature.id);
                const isRecommended = websiteType ? feature.defaultFor.includes(websiteType) : false;

                return (
                  <div
                    key={feature.id}
                    className={cn(
                      'flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer',
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                    )}
                    onClick={() => onToggleFeature(feature.id)}
                  >
                    <Checkbox
                      id={feature.id}
                      checked={isSelected}
                      onCheckedChange={() => onToggleFeature(feature.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Label
                          htmlFor={feature.id}
                          className="font-medium cursor-pointer"
                        >
                          {lang === 'th' ? feature.nameTh : feature.name}
                        </Label>
                        {isRecommended && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {lang === 'th' ? 'แนะนำ' : 'Recommended'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lang === 'th' ? feature.descriptionTh : feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

