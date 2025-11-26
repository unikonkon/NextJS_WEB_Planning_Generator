'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
  GitBranch,
  X,
  Download,
  Copy,
  CheckCircle2,
  Loader2,
  Edit3,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { updateFlowchart, type FlowchartHistory } from '@/lib/indexeddb';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

// ===========================================
// Props Interface
// ===========================================

interface FlowchartViewerProps {
  flowchart: FlowchartHistory | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (flowchart: FlowchartHistory) => void;
  onDelete?: (flowchart: FlowchartHistory) => void;
  isLoading?: boolean;
  error?: string | null;
  code?: string; // For new flowcharts not yet saved
}

// ===========================================
// Component
// ===========================================

export function FlowchartViewer({
  flowchart,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  isLoading = false,
  error = null,
  code,
}: FlowchartViewerProps) {
  const [svg, setSvg] = useState<string>('');
  const [renderError, setRenderError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const renderCount = useRef(0);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const mermaidCode = isEditMode ? editedCode : (code || flowchart?.mermaidCode || '');

  const renderDiagram = useCallback(async () => {
    if (!mermaidCode.trim()) {
      setSvg('');
      setRenderError('');
      return;
    }

    setIsRendering(true);
    setRenderError('');

    try {
      const id = `mermaid-${Date.now()}-${renderCount.current++}`;
      await mermaid.parse(mermaidCode);
      const { svg: renderedSvg } = await mermaid.render(id, mermaidCode);
      setSvg(renderedSvg);
    } catch (err) {
      console.error('Mermaid render error:', err);
      setRenderError(err instanceof Error ? err.message : 'Failed to render diagram');
      setSvg('');
    } finally {
      setIsRendering(false);
    }
  }, [mermaidCode]);

  useEffect(() => {
    if (isOpen && mermaidCode) {
      renderDiagram();
    }
  }, [isOpen, mermaidCode, renderDiagram]);

  // Reset state when flowchart changes
  useEffect(() => {
    setZoom(1);
    setIsEditMode(false);
    setEditedCode('');
    setSaveSuccess(false);
  }, [flowchart?.id]);

  // Initialize edited code when entering edit mode
  const handleEnterEditMode = () => {
    setEditedCode(flowchart?.mermaidCode || code || '');
    setIsEditMode(true);
    setSaveSuccess(false);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedCode('');
    setSaveSuccess(false);
  };

  // Save edited code to IndexedDB
  const handleSaveEdit = async () => {
    if (!flowchart || !editedCode.trim()) return;

    setIsSaving(true);
    try {
      await updateFlowchart(flowchart.id, { mermaidCode: editedCode });
      
      // Update the flowchart object with new code
      const updatedFlowchart: FlowchartHistory = {
        ...flowchart,
        mermaidCode: editedCode,
        updatedAt: Date.now(),
      };
      
      // Notify parent component
      if (onUpdate) {
        onUpdate(updatedFlowchart);
      }
      
      setSaveSuccess(true);
      setIsEditMode(false);
      
      // Re-render with new code
      setTimeout(() => {
        renderDiagram();
      }, 100);
    } catch (err) {
      console.error('Error saving flowchart:', err);
      setRenderError('ไม่สามารถบันทึกได้');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flowchart?.title || 'flowchart'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    if (!svg) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const scale = 2;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
      }
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${flowchart?.title || 'flowchart'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => setZoom(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="size-6 text-primary" />
              <div>
                <CardTitle>{flowchart?.title || 'Flowchart Diagram'}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  {flowchart && (
                    <>
                      <Badge variant="secondary">{flowchart.websiteTypeName}</Badge>
                      <Badge variant="outline">{flowchart.flowchartType}</Badge>
                    </>
                  )}
                  {!flowchart && 'แผนผังโครงสร้างเว็บไซต์จาก Features ที่เลือก'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {flowchart && !isEditMode && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEnterEditMode}>
                    <Edit3 className="size-4" />
                    แก้ไข
                  </Button>
                  {onDelete && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(flowchart)}>
                      <Trash2 className="size-4" />
                      ลบ
                    </Button>
                  )}
                </>
              )}
              {isEditMode && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                    <RotateCcw className="size-4" />
                    ยกเลิก
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </Button>
                </>
              )}
              {saveSuccess && !isEditMode && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle2 className="size-3 mr-1" />
                  บันทึกแล้ว
                </Badge>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
                <X className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full divide-y lg:divide-y-0 lg:divide-x">
            {/* Code Panel */}
            <div className="flex flex-col h-full min-h-0">
              <div className="bg-muted/50 px-4 py-2 flex justify-between items-center border-b shrink-0">
                <span className="font-medium text-sm">
                  {isEditMode ? '✏️ แก้ไข Mermaid Code' : '📝 Mermaid Code'}
                </span>
                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <Button variant="ghost" size="sm" onClick={renderDiagram} disabled={isRendering}>
                      <RefreshCw className={`size-4 ${isRendering ? 'animate-spin' : ''}`} />
                      Preview
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    {copied ? <CheckCircle2 className="size-4 text-green-500" /> : <Copy className="size-4" />}
                    {copied ? 'คัดลอกแล้ว!' : 'Copy'}
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {isEditMode ? (
                  <Textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    className="h-full min-h-[300px] font-mono text-xs resize-none"
                    placeholder="แก้ไข Mermaid code ที่นี่..."
                  />
                ) : (
                  <pre className="text-xs font-mono bg-muted/30 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                    {isLoading ? 'กำลังสร้าง Flowchart...' : mermaidCode || 'ยังไม่มี Code'}
                  </pre>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col h-full min-h-0">
              <div className="bg-muted/50 px-4 py-2 flex justify-between items-center border-b shrink-0">
                <span className="font-medium text-sm">👁️ Preview</span>
                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 mr-2">
                    <Button variant="ghost" size="icon" className="size-7" onClick={handleZoomOut}>
                      <ZoomOut className="size-3" />
                    </Button>
                    <span className="text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" className="size-7" onClick={handleZoomIn}>
                      <ZoomIn className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={handleResetZoom}>
                      <Maximize2 className="size-3" />
                    </Button>
                  </div>
                  
                  {/* Download Buttons */}
                  <Button variant="ghost" size="sm" onClick={handleDownloadSVG} disabled={!svg}>
                    <Download className="size-4" />
                    SVG
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownloadPNG} disabled={!svg}>
                    <Download className="size-4" />
                    PNG
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                {isLoading || isRendering ? (
                  <div className="text-center text-muted-foreground">
                    <Loader2 className="size-8 animate-spin mx-auto mb-2" />
                    <p>{isLoading ? 'กำลังสร้าง Flowchart...' : 'กำลัง Render...'}</p>
                  </div>
                ) : error || renderError ? (
                  <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-full overflow-auto">
                    <p className="font-medium mb-2">❌ Error:</p>
                    <pre className="text-sm whitespace-pre-wrap">{error || renderError}</pre>
                    <Button variant="outline" size="sm" className="mt-4" onClick={renderDiagram}>
                      <RefreshCw className="size-4" />
                      ลอง Render อีกครั้ง
                    </Button>
                  </div>
                ) : svg ? (
                  <div
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="mermaid-output transition-transform duration-200"
                  />
                ) : (
                  <div className="text-muted-foreground text-center">
                    <GitBranch className="size-12 mx-auto mb-2 opacity-30" />
                    <p>ยังไม่มี Flowchart</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        {/* Summary Stats */}
        {flowchart && (
          <div className="border-t px-4 py-3 bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Badge variant="secondary">{flowchart.summary.totalFeatures} Features</Badge>
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline">{flowchart.summary.totalComponents} Components</Badge>
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline">{flowchart.summary.totalDataModels} Models</Badge>
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline">{flowchart.summary.totalPages} Pages</Badge>
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ประมาณ {flowchart.summary.estimatedWeeks} สัปดาห์
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}

export default FlowchartViewer;

