'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ChevronLeft,
  History,
  Trash2,
  Download,
  Copy,
  Check,
  Eye,
  Globe,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  getAllGenerations,
  deleteGeneration,
  clearAllGenerations,
  type GenerationHistory,
} from '@/lib/indexeddb';
import { ResultsDisplay } from '@/components/results';
import { ExportButtons } from '@/components/export';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import type { GeneratedPlan } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [uiLang, setUiLang] = useState<'en' | 'th'>('th');
  const [generations, setGenerations] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationHistory | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | 'all' | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'single' | 'all'>('single');

  useEffect(() => {
    loadGenerations();
  }, []);

  const loadGenerations = async () => {
    setLoading(true);
    try {
      const data = await getAllGenerations();
      setGenerations(data);
    } catch (error) {
      console.error('Failed to load generations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteType('single');
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    setDeletingId(deleteTargetId);
    setDeleteDialogOpen(false);
    try {
      await deleteGeneration(deleteTargetId);
      await loadGenerations();
      if (selectedGeneration?.id === deleteTargetId) {
        setSelectedGeneration(null);
      }
    } catch (error) {
      console.error('Failed to delete generation:', error);
      alert(uiLang === 'th' ? 'ไม่สามารถลบได้' : 'Failed to delete');
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  const handleClearAllClick = () => {
    setDeleteTargetId(null);
    setDeleteType('all');
    setDeleteDialogOpen(true);
  };

  const handleClearAll = async () => {
    setDeleteDialogOpen(false);
    setDeletingId('all'); // Use a special marker for "all" deletion
    try {
      await clearAllGenerations();
      await loadGenerations();
      setSelectedGeneration(null);
    } catch (error) {
      console.error('Failed to clear all:', error);
      alert(uiLang === 'th' ? 'ไม่สามารถลบได้' : 'Failed to delete');
    } finally {
      setDeletingId(null);
      setDeleteTargetId(null);
    }
  };

  const handleCopyJSON = async (generation: GenerationHistory) => {
    try {
      const jsonData = JSON.stringify(generation.generatedPlan, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setCopiedId(generation.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadJSON = (generation: GenerationHistory) => {
    const jsonData = JSON.stringify(generation.generatedPlan, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan_${new Date(generation.timestamp).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return uiLang === 'th' ? 'วันนี้' : 'Today';
    } else if (days === 1) {
      return uiLang === 'th' ? 'เมื่อวาน' : 'Yesterday';
    } else if (days < 7) {
      return uiLang === 'th' ? `${days} วันที่แล้ว` : `${days} days ago`;
    } else {
      return date.toLocaleDateString(uiLang === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(uiLang === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show detailed view
  if (selectedGeneration) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedGeneration(null)}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{uiLang === 'th' ? 'กลับไปรายการประวัติ' : 'Back to History'}</span>
              <span className="sm:hidden">{uiLang === 'th' ? 'กลับ' : 'Back'}</span>
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label className="text-xs sm:text-sm">EN</Label>
              <Switch
                checked={uiLang === 'th'}
                onCheckedChange={(checked) => setUiLang(checked ? 'th' : 'en')}
              />
              <Label className="text-xs sm:text-sm">TH</Label>
            </div>
          </header>

          {/* Timestamp Info */}
          <Card className="mb-6">
            <CardContent className="">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{formatDate(selectedGeneration.timestamp)}</span>
                    <span>•</span>
                    <span>{formatTime(selectedGeneration.timestamp)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {selectedGeneration.projectDetails.websiteType || 'Unknown Type'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyJSON(selectedGeneration)}
                    className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
                  >
                    {copiedId === selectedGeneration.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        <span className="hidden sm:inline">{uiLang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}</span>
                        <span className="sm:hidden">{uiLang === 'th' ? 'คัดลอกแล้ว' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{uiLang === 'th' ? 'คัดลอก JSON' : 'Copy JSON'}</span>
                        <span className="sm:hidden">{uiLang === 'th' ? 'คัดลอก' : 'Copy'}</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadJSON(selectedGeneration)}
                    className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{uiLang === 'th' ? 'ดาวน์โหลด JSON' : 'Download JSON'}</span>
                    <span className="sm:hidden">{uiLang === 'th' ? 'ดาวน์โหลด' : 'Download'}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(selectedGeneration.id)}
                    disabled={deletingId === selectedGeneration.id}
                    className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{uiLang === 'th' ? 'ลบ' : 'Delete'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <ResultsDisplay
            plan={selectedGeneration.generatedPlan as GeneratedPlan}
            lang={selectedGeneration.projectDetails.outputLanguage || 'th'}
          />

          {/* Raw Response Section */}
          {selectedGeneration.rawResponse && (
            <Card className="mt-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      {uiLang === 'th' ? 'Raw Response' : 'Raw Response'}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted/50 rounded-lg overflow-auto max-h-[400px] text-sm font-mono whitespace-pre-wrap break-words leading-relaxed border">
                  {selectedGeneration.rawResponse}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Export Buttons */}
          <div className="mt-8">
            <ExportButtons
              plan={selectedGeneration.generatedPlan as GeneratedPlan}
              lang={selectedGeneration.projectDetails.outputLanguage || 'th'}
              onRegenerate={() => {}}
              isRegenerating={false}
            />
          </div>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            isDeleting={deletingId === deleteTargetId && deleteType === 'single'}
            lang={uiLang}
            type="single"
          />
        </div>
      </main>
    );
  }

  // Show list view
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push('/')} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{uiLang === 'th' ? 'กลับหน้าหลัก' : 'Back to Home'}</span>
              <span className="sm:hidden">{uiLang === 'th' ? 'กลับ' : 'Back'}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Label className="text-xs sm:text-sm">EN</Label>
            <Switch
              checked={uiLang === 'th'}
              onCheckedChange={(checked) => setUiLang(checked ? 'th' : 'en')}
            />
            <Label className="text-xs sm:text-sm">TH</Label>
          </div>
        </header>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 px-2">
            {uiLang === 'th' ? 'ประวัติการสร้างแผน' : 'Generation History'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {uiLang === 'th'
              ? 'ดูและจัดการประวัติการสร้างแผนโปรเจคทั้งหมดของคุณ'
              : 'View and manage all your project planning history'}
          </p>
        </div>

        {/* Actions */}
        {generations.length > 0 && (
          <div className="flex justify-end mb-4 sm:mb-6">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAllClick}
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{uiLang === 'th' ? 'ลบทั้งหมด' : 'Clear All'}</span>
              <span className="sm:hidden">{uiLang === 'th' ? 'ลบทั้งหมด' : 'Clear'}</span>
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">
                {uiLang === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading...'}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && generations.length === 0 && (
          <Card>
            <CardContent className="py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <AlertCircle className="w-12 h-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {uiLang === 'th' ? 'ยังไม่มีประวัติ' : 'No History Yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {uiLang === 'th'
                      ? 'เมื่อคุณสร้างแผนโปรเจค ระบบจะบันทึกประวัติไว้ที่นี่'
                      : 'When you generate a project plan, it will be saved here'}
                  </p>
                  <Button onClick={() => router.push('/')} className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    {uiLang === 'th' ? 'ไปสร้างแผน' : 'Create New Plan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History List */}
        {!loading && generations.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {generations.map((generation) => (
              <Card
                key={generation.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedGeneration(generation)}
              >
                <CardContent className="">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                        <Badge variant="secondary" className="text-xs sm:text-sm">
                          {generation.projectDetails.websiteType || 'Unknown'}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{formatDate(generation.timestamp)}</span>
                          <span>•</span>
                          <span>{formatTime(generation.timestamp)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {generation.projectDetails.projectName && (
                          <p className="font-medium text-sm sm:text-base truncate">
                            {generation.projectDetails.projectName}
                          </p>
                        )}
                        {generation.projectDetails.projectDescription && (
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-2">
                            {generation.projectDetails.projectDescription}
                          </p>
                        )}
                        {generation.projectDetails.selectedFeatures && generation.projectDetails.selectedFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {generation.projectDetails.selectedFeatures.slice(0, 3).map((feature: string) => (
                              <Badge key={feature} variant="outline" className="text-[10px] sm:text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {generation.projectDetails.selectedFeatures.length > 3 && (
                              <Badge variant="outline" className="text-[10px] sm:text-xs">
                                +{generation.projectDetails.selectedFeatures.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div 
                      className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGeneration(generation)}
                        className="gap-1.5 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{uiLang === 'th' ? 'ดู' : 'View'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyJSON(generation)}
                        className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                        title={uiLang === 'th' ? 'คัดลอก' : 'Copy'}
                      >
                        {copiedId === generation.id ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadJSON(generation)}
                        className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                        title={uiLang === 'th' ? 'ดาวน์โหลด' : 'Download'}
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(generation.id)}
                        disabled={deletingId === generation.id}
                        className="gap-1.5 sm:gap-2 text-destructive hover:text-destructive h-8 sm:h-9 px-2 sm:px-3"
                        title={uiLang === 'th' ? 'ลบ' : 'Delete'}
                      >
                        {deletingId === generation.id ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={deleteType === 'all' ? handleClearAll : handleDelete}
          isDeleting={
            (deleteType === 'single' && deletingId === deleteTargetId) ||
            (deleteType === 'all' && deletingId === 'all')
          }
          lang={uiLang}
          type={deleteType}
        />
      </div>
    </main>
  );
}

