'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Save, RefreshCw, Loader2 } from 'lucide-react';
import { exportToPDF } from '@/lib/export-pdf';
import { exportToWord } from '@/lib/export-word';
import { saveProject } from '@/lib/storage';
import type { GeneratedPlan } from '@/types';

interface ExportButtonsProps {
  plan: GeneratedPlan;
  lang: 'en' | 'th';
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function ExportButtons({ plan, lang, onRegenerate, isRegenerating }: ExportButtonsProps) {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExportPDF = async () => {
    setExportingPdf(true);
    try {
      await exportToPDF(plan, lang);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportWord = async () => {
    setExportingWord(true);
    try {
      await exportToWord(plan, lang);
    } catch (error) {
      console.error('Error exporting Word:', error);
    } finally {
      setExportingWord(false);
    }
  };

  const handleSave = () => {
    setSaving(true);
    try {
      saveProject({
        id: plan.id,
        name: plan.projectName,
        createdAt: plan.generatedAt,
        updatedAt: new Date().toISOString(),
        inputData: plan.inputData,
        generatedPlan: plan,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center p-4 bg-muted/30 rounded-lg">
      <Button
        variant="outline"
        onClick={handleExportPDF}
        disabled={exportingPdf}
        className="gap-2"
      >
        {exportingPdf ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {lang === 'th' ? 'ส่งออก PDF' : 'Export PDF'}
      </Button>

      <Button
        variant="outline"
        onClick={handleExportWord}
        disabled={exportingWord}
        className="gap-2"
      >
        {exportingWord ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        {lang === 'th' ? 'ส่งออก Word' : 'Export Word'}
      </Button>

      <Button
        variant="outline"
        onClick={handleSave}
        disabled={saving}
        className={`gap-2 ${saved ? 'bg-green-500/10 border-green-500 text-green-600' : ''}`}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saved 
          ? (lang === 'th' ? 'บันทึกแล้ว!' : 'Saved!')
          : (lang === 'th' ? 'บันทึกโปรเจค' : 'Save Project')
        }
      </Button>

      <Button
        variant="default"
        onClick={onRegenerate}
        disabled={isRegenerating}
        className="gap-2"
      >
        {isRegenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {lang === 'th' ? 'สร้างใหม่' : 'Regenerate'}
      </Button>
    </div>
  );
}

