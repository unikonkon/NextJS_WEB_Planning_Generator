'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buildPrompt } from '@/lib/prompt-builder';
import type { ProjectDetails } from '@/types';
import { FileCode, RotateCcw, Copy, Check, Eye, Edit3, Info, Zap } from 'lucide-react';

interface StepFourProps {
  details: ProjectDetails;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  lang: 'en' | 'th';
}

export function StepFour({ details, prompt, onPromptChange, lang }: StepFourProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultPrompt = buildPrompt(details);

  const handleReset = () => {
    onPromptChange(defaultPrompt);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Count tokens (approximate)
  const tokenCount = Math.ceil(prompt.length / 4);
  const lineCount = prompt.split('\n').length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {lang === 'th' ? 'ตรวจสอบและแก้ไข Prompt' : 'Review & Edit Prompt'}
        </h2>
        <p className="text-muted-foreground">
          {lang === 'th'
            ? 'ตรวจสอบ Prompt ที่จะส่งให้ AI และแก้ไขเพิ่มเติมได้ตามต้องการ'
            : 'Review the prompt that will be sent to AI and edit as needed.'}
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">
                {lang === 'th' ? 'AI Prompt' : 'AI Prompt'}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                ~{tokenCount.toLocaleString()} tokens
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {lineCount} {lang === 'th' ? 'บรรทัด' : 'lines'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Eye className="w-4 h-4" />
                  {lang === 'th' ? 'ดูอย่างเดียว' : 'View Only'}
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  {lang === 'th' ? 'แก้ไข' : 'Edit'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  {lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {lang === 'th' ? 'คัดลอก' : 'Copy'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
              disabled={prompt === defaultPrompt}
            >
              <RotateCcw className="w-4 h-4" />
              {lang === 'th' ? 'รีเซ็ต' : 'Reset'}
            </Button>
          </div>

          {/* Prompt Editor/Viewer */}
          <div className="relative">
            {isEditing ? (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {lang === 'th'
                    ? '💡 แก้ไข prompt เพื่อปรับแต่งผลลัพธ์ตามต้องการ'
                    : '💡 Edit the prompt to customize the output'}
                </Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  className="min-h-[500px] font-mono text-sm leading-relaxed resize-y"
                  placeholder="Enter your prompt..."
                />
              </div>
            ) : (
              <div className="relative">
                <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[500px] text-sm font-mono whitespace-pre-wrap break-words leading-relaxed border">
                  {prompt}
                </pre>
              </div>
            )}
          </div>

          {/* Modified indicator */}
          {prompt !== defaultPrompt && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                {lang === 'th' ? '✏️ Prompt ถูกแก้ไขแล้ว' : '✏️ Prompt has been modified'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gemini 2.5 Flash Lite Specifications */}
      <Card className="max-w-4xl mx-auto border-primary/20 bg-primary/5">
        <CardHeader className="">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">
              {lang === 'th' ? 'ใช้งาน Gemini 2.5 Flash Lite - ขอบเขตการสร้างผลลัพธ์' : 'Gemini 2.5 Flash Lite - Token Limits & Generation Config'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {lang === 'th' ? 'ข้อมูลนำเข้า (หน้าต่างบริบท)' : 'Input (Context Window)'}
                </span>
              </div>
              <div className="text-2xl font-bold">
                1,000,000
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === 'th' ? 'tokens (1 ล้าน tokens)' : 'tokens (1 million tokens)'}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {lang === 'th' ? 'ผลลัพธ์ (จำกัดการสร้าง)' : 'Output (Max Output)'}
                </span>
              </div>
              <div className="text-2xl font-bold">
                65,536
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === 'th' ? 'tokens' : 'tokens'}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {lang === 'th' ? 'ข้อมูลล่าสุด' : 'Knowledge Cutoff'}
                </span>
              </div>
              <div className="text-2xl font-bold">
                Jan 1, 2025
              </div>
              <div className="text-sm text-muted-foreground">
                {lang === 'th' ? 'ข้อมูลล่าสุด' : 'Latest data'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

