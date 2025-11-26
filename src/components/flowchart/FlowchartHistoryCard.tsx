'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
  GitBranch,
  Calendar,
  Code2,
  Database,
  FileCode,
  Eye,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  MoreVertical,
  Clock,
  Zap,
  ShoppingCart,
  FileText,
  Briefcase,
  Cloud,
  Rocket,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FlowchartHistory } from '@/lib/indexeddb';

// Initialize mermaid for preview
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
// Helper Functions
// ===========================================

const getWebsiteIcon = (type: string) => {
  switch (type) {
    case 'ecommerce':
      return <ShoppingCart className="size-5" />;
    case 'blog':
      return <FileText className="size-5" />;
    case 'portfolio':
      return <Briefcase className="size-5" />;
    case 'saas':
      return <Cloud className="size-5" />;
    case 'landing':
      return <Rocket className="size-5" />;
    default:
      return <GitBranch className="size-5" />;
  }
};

const getWebsiteColor = (type: string) => {
  switch (type) {
    case 'ecommerce':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'blog':
      return 'text-blue-500 bg-blue-500/10';
    case 'portfolio':
      return 'text-violet-500 bg-violet-500/10';
    case 'saas':
      return 'text-orange-500 bg-orange-500/10';
    case 'landing':
      return 'text-rose-500 bg-rose-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

const getFlowchartTypeLabel = (type: string) => {
  switch (type) {
    case 'feature-overview':
      return 'Feature Overview';
    case 'user-flow':
      return 'User Flow';
    case 'data-flow':
      return 'Data Flow';
    case 'page-structure':
      return 'Page Structure';
    default:
      return type;
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;
  return formatDate(timestamp);
};

// ===========================================
// Props Interface
// ===========================================

interface FlowchartHistoryCardProps {
  flowchart: FlowchartHistory;
  onView: (flowchart: FlowchartHistory) => void;
  onDelete: (flowchart: FlowchartHistory) => void;
  compact?: boolean;
}

// ===========================================
// Component
// ===========================================

export function FlowchartHistoryCard({
  flowchart,
  onView,
  onDelete,
  compact = false,
}: FlowchartHistoryCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewSvg, setPreviewSvg] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate mini preview
  useEffect(() => {
    const generatePreview = async () => {
      if (!flowchart.mermaidCode) return;
      
      try {
        const id = `preview-${flowchart.id}-${Date.now()}`;
        await mermaid.parse(flowchart.mermaidCode);
        const { svg } = await mermaid.render(id, flowchart.mermaidCode);
        setPreviewSvg(svg);
      } catch (error) {
        console.error('Preview render error:', error);
      }
    };

    generatePreview();
  }, [flowchart.id, flowchart.mermaidCode]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(flowchart.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!previewSvg) return;
    const blob = new Blob([previewSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flowchart.title || 'flowchart'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (compact) {
    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
        onClick={() => onView(flowchart)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getWebsiteColor(flowchart.websiteType)}`}>
              {getWebsiteIcon(flowchart.websiteType)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{flowchart.title}</h3>
              <p className="text-sm text-muted-foreground">
                {flowchart.websiteTypeName} • {getFlowchartTypeLabel(flowchart.flowchartType)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatRelativeTime(flowchart.timestamp)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      {/* Preview Section */}
      <div
        className="h-40 bg-muted/30 flex items-center justify-center cursor-pointer relative group"
        onClick={() => onView(flowchart)}
      >
        {previewSvg ? (
          <div
            ref={previewRef}
            className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
            style={{ transform: 'scale(0.5)', transformOrigin: 'center' }}
            dangerouslySetInnerHTML={{ __html: previewSvg }}
          />
        ) : (
          <GitBranch className="size-12 text-muted-foreground/30" />
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onView(flowchart); }}>
            <Eye className="size-4" />
            ดู
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${getWebsiteColor(flowchart.websiteType)}`}>
              {getWebsiteIcon(flowchart.websiteType)}
            </div>
            <div>
              <CardTitle className="text-lg">{flowchart.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {flowchart.websiteTypeName}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getFlowchartTypeLabel(flowchart.flowchartType)}
                </Badge>
              </CardDescription>
            </div>
          </div>
          
          {/* Menu Button */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="size-4" />
            </Button>
            
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-popover border rounded-lg shadow-lg z-20 min-w-[160px]">
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => { onView(flowchart); setShowMenu(false); }}
                  >
                    <Eye className="size-4" />
                    ดู & แก้ไข
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => { handleCopyCode(); setShowMenu(false); }}
                  >
                    {copied ? <CheckCircle2 className="size-4 text-green-500" /> : <Copy className="size-4" />}
                    {copied ? 'คัดลอกแล้ว!' : 'คัดลอก Code'}
                  </button>
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    onClick={() => { handleDownloadSVG(); setShowMenu(false); }}
                    disabled={!previewSvg}
                  >
                    <Download className="size-4" />
                    ดาวน์โหลด SVG
                  </button>
                  <hr className="my-1" />
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    onClick={() => { onDelete(flowchart); setShowMenu(false); }}
                  >
                    <Trash2 className="size-4" />
                    ลบ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Zap className="size-4 text-primary" />
            </div>
            <div className="text-lg font-semibold">{flowchart.summary.totalFeatures}</div>
            <div className="text-xs text-muted-foreground">Features</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Code2 className="size-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold">{flowchart.summary.totalComponents}</div>
            <div className="text-xs text-muted-foreground">Components</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Database className="size-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold">{flowchart.summary.totalDataModels}</div>
            <div className="text-xs text-muted-foreground">Models</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <FileCode className="size-4 text-orange-500" />
            </div>
            <div className="text-lg font-semibold">{flowchart.summary.totalPages}</div>
            <div className="text-xs text-muted-foreground">Pages</div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span className="text-sm">ระยะเวลาประมาณ</span>
          </div>
          <span className="font-semibold text-primary">{flowchart.summary.estimatedWeeks} สัปดาห์</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-3" />
          <span>สร้างเมื่อ {formatDate(flowchart.timestamp)}</span>
          {flowchart.updatedAt !== flowchart.timestamp && (
            <span className="ml-2">• แก้ไขล่าสุด {formatRelativeTime(flowchart.updatedAt)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FlowchartHistoryCard;

