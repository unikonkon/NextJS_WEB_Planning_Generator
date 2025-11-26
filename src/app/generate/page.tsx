'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Rocket, 
  Loader2,
  Globe,
  AlertCircle,
  FileText,
  Copy,
  Check,
  History
} from 'lucide-react';
import { WizardProgress, StepOne, StepTwo, StepThree, StepFour } from '@/components/wizard';
import { ResultsDisplay } from '@/components/results';
import { ExportButtons } from '@/components/export';
import { DEFAULT_PROJECT_DETAILS } from '@/data/constants';
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage';
import { buildPrompt } from '@/lib/prompt-builder';
import { saveGeneration } from '@/lib/indexeddb';
import type { ProjectDetails, GeneratedPlan, WebsiteTypeId } from '@/types';

const WIZARD_LABELS = [
  { en: 'Website Type', th: 'ประเภทเว็บ' },
  { en: 'Features', th: 'ฟีเจอร์' },
  { en: 'Details', th: 'รายละเอียด' },
  { en: 'Prompt', th: 'Prompt' },
];

export default function GeneratePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [details, setDetails] = useState<ProjectDetails>(DEFAULT_PROJECT_DETAILS);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uiLang, setUiLang] = useState<'en' | 'th'>('th');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setDetails(draft.details);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (details.websiteType || details.selectedFeatures.length > 0) {
        saveDraft(details);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [details]);

  // Update prompt when entering step 4
  useEffect(() => {
    if (currentStep === 4 && !customPrompt) {
      setCustomPrompt(buildPrompt(details));
    }
  }, [currentStep, details, customPrompt]);

  const handleSelectType = useCallback((typeId: WebsiteTypeId, defaultFeatures: string[]) => {
    setDetails(prev => ({
      ...prev,
      websiteType: typeId,
      selectedFeatures: defaultFeatures,
    }));
    // Reset prompt when type changes
    setCustomPrompt('');
  }, []);

  const handleToggleFeature = useCallback((featureId: string) => {
    setDetails(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(f => f !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
    // Reset prompt when features change
    setCustomPrompt('');
  }, []);

  const handleUpdateDetails = useCallback((updates: Partial<ProjectDetails>) => {
    setDetails(prev => ({ ...prev, ...updates }));
    // Reset prompt when details change
    setCustomPrompt('');
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setRawResponse(null);
    setShowRawResponse(false);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectDetails: details,
          customPrompt: customPrompt || undefined,
        }),
      });
      
      const data = await response.json();
      
      // Store raw response if available
      if (data.rawResponse) {
        setRawResponse(data.rawResponse);
      }
      
      if (!data.success) {
        // If we have raw response but parsing failed, show it
        if (data.rawResponse) {
          setShowRawResponse(true);
          setError(data.error || 'Failed to parse response');
        } else {
          throw new Error(data.error || 'Failed to generate plan');
        }
        return;
      }
      
      setGeneratedPlan(data.plan);
      clearDraft();
      
      // Save to IndexedDB
      try {
        await saveGeneration({
          projectDetails: details,
          generatedPlan: data.plan,
          rawResponse: data.rawResponse,
          customPrompt: customPrompt || undefined,
        });
      } catch (dbError) {
        console.error('Failed to save to IndexedDB:', dbError);
        // Don't show error to user, just log it
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleReset = () => {
    setGeneratedPlan(null);
    setCurrentStep(1);
    setDetails(DEFAULT_PROJECT_DETAILS);
    setError(null);
    setCustomPrompt('');
    setRawResponse(null);
    setShowRawResponse(false);
  };

  const handleCopyRaw = async () => {
    if (rawResponse) {
      await navigator.clipboard.writeText(rawResponse);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!details.websiteType;
      case 2:
        return details.selectedFeatures.length > 0;
      case 3:
        return true;
      case 4:
        return customPrompt.trim().length > 0;
      default:
        return false;
    }
  };

  const canNavigateToStep = (step: number) => {
    // Allow navigation to step 1 always
    if (step === 1) return true;
    
    // For step 2, need website type selected
    if (step === 2) return !!details.websiteType;
    
    // For step 3, need website type and at least one feature
    if (step === 3) return !!details.websiteType && details.selectedFeatures.length > 0;
    
    // For step 4, need website type and at least one feature
    if (step === 4) return !!details.websiteType && details.selectedFeatures.length > 0;
    
    return false;
  };

  const handleStepClick = (step: number) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  // If plan is generated, show results
  if (generatedPlan) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              {uiLang === 'th' ? 'สร้างใหม่' : 'Start New'}
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/history')}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                {uiLang === 'th' ? 'ประวัติ' : 'History'}
              </Button>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm">EN</Label>
                <Switch
                  checked={uiLang === 'th'}
                  onCheckedChange={(checked) => setUiLang(checked ? 'th' : 'en')}
                />
                <Label className="text-sm">TH</Label>
              </div>
            </div>
          </header>

          {/* Results */}
          <ResultsDisplay plan={generatedPlan} lang={details.outputLanguage} />
          
          {/* Raw Response Section */}
          {rawResponse && (
            <Card className="mt-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {uiLang === 'th' ? 'Raw Response จาก AI' : 'Raw AI Response'}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRawResponse(!showRawResponse)}
                    >
                      {showRawResponse 
                        ? (uiLang === 'th' ? 'ซ่อน' : 'Hide')
                        : (uiLang === 'th' ? 'แสดง' : 'Show')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyRaw}
                      className="gap-2"
                    >
                      {copiedRaw ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          {uiLang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {uiLang === 'th' ? 'คัดลอก' : 'Copy'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {showRawResponse && (
                <CardContent>
                  <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[600px] text-sm font-mono whitespace-pre-wrap break-words leading-relaxed border">
                    {rawResponse}
                  </pre>
                </CardContent>
              )}
            </Card>
          )}
          
          {/* Export Buttons */}
          <div className="mt-8">
            <ExportButtons 
              plan={generatedPlan} 
              lang={details.outputLanguage}
              onRegenerate={handleRegenerate}
              isRegenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    );
  }

  // Show raw response view when parsing failed
  if (showRawResponse && rawResponse && error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={handleReset} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              {uiLang === 'th' ? 'เริ่มใหม่' : 'Start Over'}
            </Button>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/history')}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                {uiLang === 'th' ? 'ประวัติ' : 'History'}
              </Button>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Label className="text-sm">EN</Label>
                <Switch
                  checked={uiLang === 'th'}
                  onCheckedChange={(checked) => setUiLang(checked ? 'th' : 'en')}
                />
                <Label className="text-sm">TH</Label>
              </div>
            </div>
          </header>

          {/* Error Message */}
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {uiLang === 'th' ? 'ไม่สามารถ Parse JSON ได้' : 'Could not parse JSON'}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
            </div>
          </div>

          {/* Raw Response */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">
                    {uiLang === 'th' ? 'Raw Response จาก AI' : 'Raw AI Response'}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {rawResponse.length.toLocaleString()} chars
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyRaw}
                    className="gap-2"
                  >
                    {copiedRaw ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        {uiLang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {uiLang === 'th' ? 'คัดลอก' : 'Copy'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[600px] text-sm font-mono whitespace-pre-wrap break-words leading-relaxed border">
                {rawResponse}
              </pre>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => setCurrentStep(4)} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              {uiLang === 'th' ? 'กลับไปแก้ไข Prompt' : 'Back to Edit Prompt'}
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uiLang === 'th' ? 'กำลังสร้างใหม่...' : 'Regenerating...'}
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  {uiLang === 'th' ? 'ลองใหม่' : 'Try Again'}
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-8">
          {/* <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div> */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {uiLang === 'th' 
              ? 'AI-Powered Discovery & Planning' 
              : 'AI-Powered Discovery & Planning'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {uiLang === 'th'
              ? 'สร้างเอกสาร Discovery และแผนโปรเจคอัตโนมัติด้วย AI ครบทุกด้าน ตั้งแต่ Requirements จนถึง Risk Assessment'
              : 'Generate comprehensive project discovery documents automatically with AI - from Requirements to Risk Assessment'}
          </p>
          
          {/* Language Toggle & History */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/history')}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              {uiLang === 'th' ? 'ดูประวัติ' : 'View History'}
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">EN</Label>
              <Switch
                checked={uiLang === 'th'}
                onCheckedChange={(checked) => setUiLang(checked ? 'th' : 'en')}
              />
              <Label className="text-sm">TH</Label>
            </div>
          </div>
        </header>

        {/* Progress */}
        <WizardProgress 
          currentStep={currentStep} 
          totalSteps={4} 
          labels={WIZARD_LABELS}
          lang={uiLang}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
        />

        {/* Wizard Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <StepOne 
                selectedType={details.websiteType}
                onSelectType={handleSelectType}
                lang={uiLang}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                websiteType={details.websiteType}
                selectedFeatures={details.selectedFeatures}
                onToggleFeature={handleToggleFeature}
                lang={uiLang}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                details={details}
                onUpdateDetails={handleUpdateDetails}
                lang={uiLang}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                details={details}
                prompt={customPrompt || buildPrompt(details)}
                onPromptChange={setCustomPrompt}
                lang={uiLang}
              />
            )}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && !showRawResponse && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">
                {uiLang === 'th' ? 'เกิดข้อผิดพลาด' : 'Error'}
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {uiLang === 'th' ? 'ย้อนกลับ' : 'Back'}
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              {uiLang === 'th' ? 'ถัดไป' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={!canProceed() || isGenerating}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uiLang === 'th' ? 'กำลังสร้าง...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  {uiLang === 'th' ? 'สร้าง Discovery & Planning' : 'Generate Discovery & Planning'}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {uiLang === 'th' ? 'AI กำลังวิเคราะห์และสร้างแผน' : 'AI is analyzing and generating your plan'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {uiLang === 'th' 
                      ? 'กรุณารอสักครู่ ประมาณ 10-30 วินาที...'
                      : 'Please wait, approximately 10-30 seconds...'}
                  </p>
                </div>
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
