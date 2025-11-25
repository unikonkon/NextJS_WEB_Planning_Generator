'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TARGET_AUDIENCES, TIMELINE_OPTIONS, BUDGET_RANGES, formatBudget } from '@/data/constants';
import type { ProjectDetails } from '@/types';
import { Globe, Calendar, Users, Wallet, FileText } from 'lucide-react';

interface StepThreeProps {
  details: ProjectDetails;
  onUpdateDetails: (updates: Partial<ProjectDetails>) => void;
  lang: 'en' | 'th';
}

export function StepThree({ details, onUpdateDetails, lang }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {lang === 'th' ? 'กรอกรายละเอียดเพิ่มเติม' : 'Additional Details'}
        </h2>
        <p className="text-muted-foreground">
          {lang === 'th'
            ? 'ข้อมูลเหล่านี้จะช่วยให้ AI สร้างแผนที่ตรงกับความต้องการมากขึ้น'
            : 'This information helps AI generate a more accurate plan.'}
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {/* Project Name */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="projectName" className="font-medium">
                  {lang === 'th' ? 'ชื่อโปรเจค' : 'Project Name'}
                </Label>
              </div>
              <Input
                id="projectName"
                placeholder={lang === 'th' ? 'เช่น ร้านค้าออนไลน์ ABC' : 'e.g. ABC Online Store'}
                value={details.projectName}
                onChange={(e) => onUpdateDetails({ projectName: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="targetAudience" className="font-medium">
                  {lang === 'th' ? 'กลุ่มเป้าหมาย' : 'Target Audience'}
                </Label>
              </div>
              <Select
                value={details.targetAudience}
                onValueChange={(value) => onUpdateDetails({ targetAudience: value })}
              >
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder={lang === 'th' ? 'เลือกกลุ่มเป้าหมาย' : 'Select target audience'} />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_AUDIENCES.map((audience) => (
                    <SelectItem key={audience.id} value={audience.id}>
                      {lang === 'th' ? audience.nameTh : audience.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget Range */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-medium">
                    {lang === 'th' ? 'งบประมาณ' : 'Budget'}
                  </Label>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatBudget(details.budgetRange[0], lang)} - {formatBudget(details.budgetRange[1], lang)}
                </span>
              </div>
              <Slider
                min={BUDGET_RANGES.min}
                max={BUDGET_RANGES.max}
                step={BUDGET_RANGES.step}
                value={details.budgetRange}
                onValueChange={(value) => onUpdateDetails({ budgetRange: value as [number, number] })}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatBudget(BUDGET_RANGES.min, lang)}</span>
                <span>{formatBudget(BUDGET_RANGES.max, lang)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="timeline" className="font-medium">
                  {lang === 'th' ? 'ระยะเวลาพัฒนา' : 'Development Timeline'}
                </Label>
              </div>
              <Select
                value={details.timeline}
                onValueChange={(value) => onUpdateDetails({ timeline: value })}
              >
                <SelectTrigger id="timeline">
                  <SelectValue placeholder={lang === 'th' ? 'เลือกระยะเวลา' : 'Select timeline'} />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {lang === 'th' ? option.nameTh : option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Label htmlFor="additionalInfo" className="font-medium">
                {lang === 'th' ? 'รายละเอียดเพิ่มเติม (ไม่บังคับ)' : 'Additional Information (Optional)'}
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder={
                  lang === 'th'
                    ? 'อธิบายความต้องการพิเศษ ข้อจำกัด หรือรายละเอียดอื่นๆ ที่ต้องการให้ AI พิจารณา...'
                    : 'Describe any special requirements, constraints, or details you want AI to consider...'
                }
                value={details.additionalInfo}
                onChange={(e) => onUpdateDetails({ additionalInfo: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Toggle */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <Label className="font-medium">
                    {lang === 'th' ? 'ภาษาผลลัพธ์' : 'Output Language'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {lang === 'th' 
                      ? 'เลือกภาษาสำหรับเอกสารที่สร้าง' 
                      : 'Select language for generated documents'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${details.outputLanguage === 'en' ? 'font-medium' : 'text-muted-foreground'}`}>
                  EN
                </span>
                <Switch
                  checked={details.outputLanguage === 'th'}
                  onCheckedChange={(checked) => 
                    onUpdateDetails({ outputLanguage: checked ? 'th' : 'en' })
                  }
                />
                <span className={`text-sm ${details.outputLanguage === 'th' ? 'font-medium' : 'text-muted-foreground'}`}>
                  TH
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

