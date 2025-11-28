'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import mermaid from 'mermaid';
import {
  ShoppingCart,
  FileText,
  Briefcase,
  Cloud,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Star,
  AlertCircle,
  Layers,
  Code2,
  Database,
  Link2,
  FileCode,
  ArrowRight,
  Sparkles,
  CircleDot,
  RefreshCw,
  Download,
  Copy,
  CheckCircle2,
  Loader2,
  GitBranch,
  Users,
  Route,
  LayoutGrid,
  X,
  Save,
  History,
  Home,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  websiteFeatures,
  type WebsiteType,
  type FeatureDetail,
  type Priority,
  type Complexity,
} from './WebsiteType';
import { saveFlowchart, type FlowchartHistory } from '@/lib/indexeddb';

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

// ============================================
// Types
// ============================================

interface SelectedFeature {
  key: string;
  category: 'core' | 'advanced';
  feature: FeatureDetail;
}

type FlowchartType = 'feature-overview' | 'user-flow' | 'data-flow' | 'page-structure';

// ============================================
// Constants
// ============================================

const STEPS = [
  { id: 1, title: 'เลือกประเภทเว็บไซต์', description: 'เลือกประเภทเว็บที่ต้องการสร้าง' },
  { id: 2, title: 'Core Features', description: 'เลือก Features หลักที่จำเป็น' },
  { id: 3, title: 'Advanced Features', description: 'เลือก Features เสริม' },
  { id: 4, title: 'สรุปผล', description: 'ตรวจสอบรายละเอียดทั้งหมด' },
];

const WEBSITE_TYPES: { type: WebsiteType; name: string; description: string; icon: React.ReactNode; color: string; gradient: string }[] = [
  {
    type: 'ecommerce',
    name: 'E-Commerce',
    description: 'ร้านค้าออนไลน์พร้อมระบบตะกร้าสินค้า ชำระเงิน และจัดการคำสั่งซื้อ',
    icon: <ShoppingCart className="size-8" />,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    type: 'blog',
    name: 'Blog',
    description: 'เว็บบล็อกพร้อมระบบจัดการบทความ หมวดหมู่ และความคิดเห็น',
    icon: <FileText className="size-8" />,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'เว็บพอร์ตโฟลิโอแสดงผลงาน ทักษะ และประสบการณ์',
    icon: <Briefcase className="size-8" />,
    color: 'text-violet-500',
    gradient: 'from-violet-500/20 to-violet-500/5',
  },
  {
    type: 'saas',
    name: 'SaaS',
    description: 'แอปพลิเคชัน SaaS พร้อมระบบสมาชิก การชำระเงิน และแดชบอร์ด',
    icon: <Cloud className="size-8" />,
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
  {
    type: 'landing',
    name: 'Landing Page',
    description: 'หน้า Landing Page สำหรับโปรโมทสินค้าหรือบริการ',
    icon: <Rocket className="size-8" />,
    color: 'text-rose-500',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },
];

const FLOWCHART_TYPES: { type: FlowchartType; name: string; description: string; icon: React.ReactNode }[] = [
  {
    type: 'feature-overview',
    name: 'Feature Overview',
    description: 'ภาพรวมความสัมพันธ์ของ Features ทั้งหมด',
    icon: <LayoutGrid className="size-5" />,
  },
  {
    type: 'user-flow',
    name: 'User Flow',
    description: 'การเดินทางของผู้ใช้ผ่านระบบ',
    icon: <Users className="size-5" />,
  },
  {
    type: 'data-flow',
    name: 'Data Flow',
    description: 'การไหลของข้อมูลในระบบ',
    icon: <Database className="size-5" />,
  },
  {
    type: 'page-structure',
    name: 'Page Structure',
    description: 'โครงสร้าง Routes และหน้าเว็บ',
    icon: <Route className="size-5" />,
  },
];

// ============================================
// Helper Functions
// ============================================

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'required':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'recommended':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'optional':
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
};

const getPriorityLabel = (priority: Priority) => {
  switch (priority) {
    case 'required':
      return 'จำเป็น';
    case 'recommended':
      return 'แนะนำ';
    case 'optional':
      return 'เสริม';
  }
};

const getComplexityColor = (complexity: Complexity) => {
  switch (complexity) {
    case 'low':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'high':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
};

const getComplexityLabel = (complexity: Complexity) => {
  switch (complexity) {
    case 'low':
      return 'ง่าย';
    case 'medium':
      return 'ปานกลาง';
    case 'high':
      return 'ซับซ้อน';
  }
};

// ============================================
// Mermaid Viewer Component
// ============================================

function MermaidViewer({
  code,
  onClose,
  isLoading,
  error,
  onSave,
  isSaving,
  isSaved,
}: {
  code: string;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}) {
  const [svg, setSvg] = useState<string>('');
  const [renderError, setRenderError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const renderCount = useRef(0);

  const renderDiagram = useCallback(async () => {
    if (!code.trim()) {
      setSvg('');
      setRenderError('');
      return;
    }

    setIsRendering(true);
    setRenderError('');

    try {
      const id = `mermaid-${Date.now()}-${renderCount.current++}`;
      await mermaid.parse(code);
      const { svg: renderedSvg } = await mermaid.render(id, code);
      setSvg(renderedSvg);
    } catch (err) {
      console.error('Mermaid render error:', err);
      setRenderError(err instanceof Error ? err.message : 'Failed to render diagram');
      setSvg('');
    } finally {
      setIsRendering(false);
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      renderDiagram();
    }
  }, [code, renderDiagram]);

  const downloadSVG = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPNG = async () => {
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
      link.download = 'flowchart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="size-6 text-primary" />
              <div>
                <CardTitle>Flowchart Diagram</CardTitle>
                <CardDescription>แผนผังโครงสร้างเว็บไซต์จาก Features ที่เลือก</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onSave && code && !isLoading && !error && !renderError && (
                <Button
                  onClick={onSave}
                  disabled={isSaving || isSaved}
                  variant={isSaved ? "secondary" : "default"}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      บันทึกแล้ว
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      บันทึก
                    </>
                  )}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full divide-y lg:divide-y-0 lg:divide-x">
            {/* Code Panel */}
            <div className="flex flex-col h-full min-h-0">
              <div className="bg-muted/50 px-4 py-2 flex justify-between items-center border-b flex-shrink-0">
                <span className="font-medium text-sm">📝 Mermaid Code</span>
                <Button variant="ghost" size="sm" onClick={copyCode}>
                  <Copy className="size-4" />
                  Copy
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs font-mono bg-muted/30 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                  {isLoading ? 'กำลังสร้าง Flowchart...' : code || 'ยังไม่มี Code'}
                </pre>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col h-full min-h-0">
              <div className="bg-muted/50 px-4 py-2 flex justify-between items-center border-b flex-shrink-0">
                <span className="font-medium text-sm">👁️ Preview</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={downloadSVG} disabled={!svg}>
                    <Download className="size-4" />
                    SVG
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadPNG} disabled={!svg}>
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
                  </div>
                ) : svg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="mermaid-output max-w-full"
                  />
                ) : (
                  <div className="text-muted-foreground text-center">
                    <GitBranch className="size-12 mx-auto mb-2 opacity-30" />
                    <p>คลิกปุ่ม "สร้าง Flowchart" เพื่อเริ่มต้น</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Components
// ============================================

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: typeof STEPS }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center size-12 rounded-full border-2 transition-all duration-300 ${currentStep > step.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : currentStep === step.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground/50'
                  }`}
              >
                {currentStep > step.id ? (
                  <Check className="size-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground/50'
                    }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function WebsiteTypeSelector({
  selectedType,
  onSelect,
}: {
  selectedType: WebsiteType | null;
  onSelect: (type: WebsiteType) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          เลือกประเภทเว็บไซต์ที่ต้องการสร้าง
        </h2>
        <p className="text-muted-foreground mt-2">
          เลือกประเภทที่เหมาะสมกับโปรเจคของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WEBSITE_TYPES.map((item) => (
          <Card
            key={item.type}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden group ${selectedType === item.type
              ? 'ring-2 ring-primary shadow-lg'
              : 'hover:border-primary/50'
              }`}
            onClick={() => onSelect(item.type)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className={`flex gap-4 items-center ${item.color}`}>
                  {item.icon}
                  <CardTitle className="mt-4">{item.name}</CardTitle>

                </div>

                {selectedType === item.type && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="size-4" />
                  </div>
                )}
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  featureKey,
  feature,
  category,
  isSelected,
  onToggle,
}: {
  featureKey: string;
  feature: FeatureDetail;
  category: 'core' | 'advanced';
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`transition-all duration-300 ${isSelected
        ? 'ring-2 ring-primary shadow-md bg-primary/5'
        : 'hover:border-primary/50 hover:shadow-sm'
        }`}
    >
      <CardHeader className="">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{feature.name}</CardTitle>
              <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                {getPriorityLabel(feature.priority)}
              </Badge>
              <Badge variant="outline" className={getComplexityColor(feature.complexity)}>
                {getComplexityLabel(feature.complexity)}
              </Badge>
            </div>
            <CardDescription className="mt-1">{feature.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
          <ChevronRight
            className={`size-4 ml-auto transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </Button>

        {expanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Components */}
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Code2 className="size-4 text-blue-500" />
                <span>Components ({feature.components.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {feature.components.map((comp) => (
                  <Badge key={comp} variant="secondary" className="text-xs font-normal">
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Data Models */}
            {feature.dataModels && feature.dataModels.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Database className="size-4 text-green-500" />
                  <span>Data Models ({feature.dataModels.length})</span>
                </div>
                <div className="space-y-1.5">
                  {feature.dataModels.map((model, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono bg-muted/50 p-2 rounded-md overflow-x-auto"
                    >
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {feature.integrations && feature.integrations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Link2 className="size-4 text-purple-500" />
                  <span>Integrations ({feature.integrations.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {feature.integrations.map((int) => (
                    <Badge key={int} variant="outline" className="text-xs font-normal">
                      {int}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pages */}
            {feature.pages && feature.pages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileCode className="size-4 text-orange-500" />
                  <span>Pages ({feature.pages.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {feature.pages.map((page) => (
                    <Badge key={page} variant="secondary" className="text-xs font-mono">
                      {page}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FeatureSelector({
  websiteType,
  category,
  selectedFeatures,
  onToggle,
}: {
  websiteType: WebsiteType;
  category: 'core' | 'advanced';
  selectedFeatures: Set<string>;
  onToggle: (key: string) => void;
}) {
  const features = websiteFeatures[websiteType][category] as Record<string, FeatureDetail>;
  const featureEntries = Object.entries(features);

  const requiredFeatures = featureEntries.filter(([, f]) => f.priority === 'required');
  const recommendedFeatures = featureEntries.filter(([, f]) => f.priority === 'recommended');
  const optionalFeatures = featureEntries.filter(([, f]) => f.priority === 'optional');

  const allSelected = featureEntries.every(([key]) => selectedFeatures.has(`${category}:${key}`));
  const requiredSelected = requiredFeatures.every(([key]) =>
    selectedFeatures.has(`${category}:${key}`)
  );

  const handleSelectAll = () => {
    featureEntries.forEach(([key]) => {
      if (!selectedFeatures.has(`${category}:${key}`)) {
        onToggle(`${category}:${key}`);
      }
    });
  };

  const handleSelectRequired = () => {
    requiredFeatures.forEach(([key]) => {
      if (!selectedFeatures.has(`${category}:${key}`)) {
        onToggle(`${category}:${key}`);
      }
    });
  };

  const categoryTitle = category === 'core' ? 'Core Features' : 'Advanced Features';
  const categoryDescription =
    category === 'core'
      ? 'Features หลักที่จำเป็นสำหรับเว็บไซต์ประเภทนี้'
      : 'Features เสริมที่เพิ่มความสามารถให้เว็บไซต์';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {category === 'core' ? (
              <Layers className="size-6 text-primary" />
            ) : (
              <Sparkles className="size-6 text-primary" />
            )}
            {categoryTitle}
          </h2>
          <p className="text-muted-foreground mt-1">{categoryDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectRequired}
            disabled={requiredSelected || requiredFeatures.length === 0}
          >
            <Star className="size-4" />
            เลือกที่จำเป็น
          </Button>
          <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={allSelected}>
            <Check className="size-4" />
            เลือกทั้งหมด
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-500/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-500">{requiredFeatures.length}</div>
          <div className="text-xs text-red-500/80">จำเป็น</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-500">{recommendedFeatures.length}</div>
          <div className="text-xs text-amber-500/80">แนะนำ</div>
        </div>
        <div className="bg-slate-500/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-slate-500">{optionalFeatures.length}</div>
          <div className="text-xs text-slate-500/80">เสริม</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        {requiredFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="size-4 text-red-500" />
              <h3 className="font-semibold text-red-500">จำเป็น (Required)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requiredFeatures.map(([key, feature]) => (
                <FeatureCard
                  key={key}
                  featureKey={key}
                  feature={feature}
                  category={category}
                  isSelected={selectedFeatures.has(`${category}:${key}`)}
                  onToggle={() => onToggle(`${category}:${key}`)}
                />
              ))}
            </div>
          </div>
        )}

        {recommendedFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="size-4 text-amber-500" />
              <h3 className="font-semibold text-amber-500">แนะนำ (Recommended)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendedFeatures.map(([key, feature]) => (
                <FeatureCard
                  key={key}
                  featureKey={key}
                  feature={feature}
                  category={category}
                  isSelected={selectedFeatures.has(`${category}:${key}`)}
                  onToggle={() => onToggle(`${category}:${key}`)}
                />
              ))}
            </div>
          </div>
        )}

        {optionalFeatures.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CircleDot className="size-4 text-slate-500" />
              <h3 className="font-semibold text-slate-500">เสริม (Optional)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {optionalFeatures.map(([key, feature]) => (
                <FeatureCard
                  key={key}
                  featureKey={key}
                  feature={feature}
                  category={category}
                  isSelected={selectedFeatures.has(`${category}:${key}`)}
                  onToggle={() => onToggle(`${category}:${key}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryView({
  websiteType,
  selectedFeatures,
  onGenerateFlowchart,
  isGenerating,
}: {
  websiteType: WebsiteType;
  selectedFeatures: Set<string>;
  onGenerateFlowchart: (type: FlowchartType) => void;
  isGenerating: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [selectedFlowchartType, setSelectedFlowchartType] = useState<FlowchartType>('feature-overview');

  const typeInfo = WEBSITE_TYPES.find((t) => t.type === websiteType);

  const coreFeatures = Array.from(selectedFeatures)
    .filter((key) => key.startsWith('core:'))
    .map((key) => {
      const featureKey = key.replace('core:', '');
      return {
        key: featureKey,
        feature: (websiteFeatures[websiteType].core as Record<string, FeatureDetail>)[featureKey],
      };
    })
    .filter((f) => f.feature);

  const advancedFeatures = Array.from(selectedFeatures)
    .filter((key) => key.startsWith('advanced:'))
    .map((key) => {
      const featureKey = key.replace('advanced:', '');
      return {
        key: featureKey,
        feature: (websiteFeatures[websiteType].advanced as Record<string, FeatureDetail>)[
          featureKey
        ],
      };
    })
    .filter((f) => f.feature);

  const allFeatures = [...coreFeatures, ...advancedFeatures];

  const totalComponents = allFeatures.reduce((acc, f) => acc + f.feature.components.length, 0);
  const totalDataModels = allFeatures.reduce(
    (acc, f) => acc + (f.feature.dataModels?.length || 0),
    0
  );
  const totalPages = allFeatures.reduce((acc, f) => acc + (f.feature.pages?.length || 0), 0);
  const allIntegrations = [...new Set(allFeatures.flatMap((f) => f.feature.integrations || []))];

  const complexityScore = allFeatures.reduce((acc, f) => {
    switch (f.feature.complexity) {
      case 'low':
        return acc + 1;
      case 'medium':
        return acc + 2;
      case 'high':
        return acc + 3;
      default:
        return acc;
    }
  }, 0);

  const estimatedWeeks = Math.ceil(complexityScore / 3);

  const generateExportData = () => {
    return {
      websiteType: typeInfo?.name,
      features: {
        core: coreFeatures.map((f) => ({
          name: f.feature.name,
          description: f.feature.description,
          priority: f.feature.priority,
          complexity: f.feature.complexity,
          components: f.feature.components,
          dataModels: f.feature.dataModels,
          integrations: f.feature.integrations,
          pages: f.feature.pages,
        })),
        advanced: advancedFeatures.map((f) => ({
          name: f.feature.name,
          description: f.feature.description,
          priority: f.feature.priority,
          complexity: f.feature.complexity,
          components: f.feature.components,
          dataModels: f.feature.dataModels,
          integrations: f.feature.integrations,
          pages: f.feature.pages,
        })),
      },
      summary: {
        totalFeatures: allFeatures.length,
        totalComponents,
        totalDataModels,
        totalPages,
        integrations: allIntegrations,
        estimatedWeeks,
      },
    };
  };

  const handleCopyToClipboard = async () => {
    const data = generateExportData();
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = generateExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteType}-website-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div
          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${typeInfo?.gradient} mb-4`}
        >
          <div className={typeInfo?.color}>{typeInfo?.icon}</div>
        </div>
        <h2 className="text-3xl font-bold">{typeInfo?.name} Website</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{typeInfo?.description}</p>
      </div>

      {/* Stats Grid */}
      {/* <Card className="text-center">
        <CardContent className="">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">{allFeatures.length}</div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalComponents}</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalDataModels}</div>
              <div className="text-sm text-muted-foreground">Data Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalPages}</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Flowchart Generation Section */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="size-5 text-violet-500" />
            สร้าง Flowchart Diagram
          </CardTitle>
          <CardDescription>
            สร้างแผนผังโครงสร้างเว็บไซต์จาก Features ที่เลือกโดยใช้ AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Flowchart Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {FLOWCHART_TYPES.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedFlowchartType(item.type)}
                  className={`p-3 rounded-lg border text-left transition-all ${selectedFlowchartType === item.type
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-border hover:border-violet-500/50'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={selectedFlowchartType === item.type ? 'text-violet-500' : 'text-muted-foreground'}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={() => onGenerateFlowchart(selectedFlowchartType)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  กำลังสร้าง Flowchart...
                </>
              ) : (
                <>
                  <GitBranch className="size-5" />
                  สร้าง Flowchart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Timeline */}
      {/* <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">ระยะเวลาโดยประมาณ</h3>
              <p className="text-muted-foreground text-sm">
                ขึ้นอยู่กับความซับซ้อนของ Features ที่เลือก
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{estimatedWeeks}</div>
              <div className="text-sm text-muted-foreground">สัปดาห์</div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Core Features Summary */}
      {coreFeatures.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Layers className="size-5 text-primary" />
            Core Features ({coreFeatures.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coreFeatures.map(({ key, feature }) => (
              <div
                key={key}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border"
              >
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">{feature.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                      {getPriorityLabel(feature.priority)}
                    </Badge>
                    <Badge variant="outline" className={getComplexityColor(feature.complexity)}>
                      {getComplexityLabel(feature.complexity)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Features Summary */}
      {advancedFeatures.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-primary" />
            Advanced Features ({advancedFeatures.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advancedFeatures.map(({ key, feature }) => (
              <div
                key={key}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border"
              >
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">{feature.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                      {getPriorityLabel(feature.priority)}
                    </Badge>
                    <Badge variant="outline" className={getComplexityColor(feature.complexity)}>
                      {getComplexityLabel(feature.complexity)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations */}
      {allIntegrations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Link2 className="size-5 text-purple-500" />
            Integrations ที่ต้องใช้ ({allIntegrations.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {allIntegrations.map((int) => (
              <Badge key={int} variant="secondary" className="text-sm">
                {int}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button variant="outline" className="flex-1" onClick={handleCopyToClipboard}>
          {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'คัดลอกแล้ว!' : 'คัดลอก JSON'}
        </Button>
        <Button className="flex-1" onClick={handleDownload}>
          <Download className="size-4" />
          ดาวน์โหลด JSON
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export default function FlowchartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [websiteType, setWebsiteType] = useState<WebsiteType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  // Flowchart state
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [flowchartCode, setFlowchartCode] = useState('');
  const [isGeneratingFlowchart, setIsGeneratingFlowchart] = useState(false);
  const [flowchartError, setFlowchartError] = useState<string | null>(null);
  const [currentFlowchartType, setCurrentFlowchartType] = useState<FlowchartType>('feature-overview');

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleFeature = (key: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setWebsiteType(null);
    setSelectedFeatures(new Set());
    setFlowchartCode('');
    setFlowchartError(null);
  };

  // Calculate summary data for saving
  const getSummaryData = useCallback(() => {
    if (!websiteType) return null;

    const coreFeatures = Array.from(selectedFeatures)
      .filter((key) => key.startsWith('core:'))
      .map((key) => {
        const featureKey = key.replace('core:', '');
        return (websiteFeatures[websiteType].core as Record<string, FeatureDetail>)[featureKey];
      })
      .filter(Boolean);

    const advancedFeatures = Array.from(selectedFeatures)
      .filter((key) => key.startsWith('advanced:'))
      .map((key) => {
        const featureKey = key.replace('advanced:', '');
        return (websiteFeatures[websiteType].advanced as Record<string, FeatureDetail>)[featureKey];
      })
      .filter(Boolean);

    const allFeatures = [...coreFeatures, ...advancedFeatures];

    const totalComponents = allFeatures.reduce((acc, f) => acc + f.components.length, 0);
    const totalDataModels = allFeatures.reduce((acc, f) => acc + (f.dataModels?.length || 0), 0);
    const totalPages = allFeatures.reduce((acc, f) => acc + (f.pages?.length || 0), 0);
    const allIntegrations = [...new Set(allFeatures.flatMap((f) => f.integrations || []))];

    const complexityScore = allFeatures.reduce((acc, f) => {
      switch (f.complexity) {
        case 'low': return acc + 1;
        case 'medium': return acc + 2;
        case 'high': return acc + 3;
        default: return acc;
      }
    }, 0);

    const estimatedWeeks = Math.ceil(complexityScore / 3);

    return {
      totalFeatures: allFeatures.length,
      totalComponents,
      totalDataModels,
      totalPages,
      integrations: allIntegrations,
      estimatedWeeks,
    };
  }, [websiteType, selectedFeatures]);

  const handleGenerateFlowchart = async (flowchartType: FlowchartType) => {
    if (!websiteType) return;

    setIsGeneratingFlowchart(true);
    setFlowchartError(null);
    setShowFlowchart(true);
    setCurrentFlowchartType(flowchartType);
    setIsSaved(false); // Reset saved state for new generation

    try {
      const response = await fetch('/api/flowchart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteType,
          selectedFeatures: Array.from(selectedFeatures),
          flowchartType,
          language: 'th',
        }),
      });

      const data = await response.json();

      if (data.success && data.mermaidCode) {
        setFlowchartCode(data.mermaidCode);
      } else {
        setFlowchartError(data.error || 'Failed to generate flowchart');
      }
    } catch (error) {
      console.error('Error generating flowchart:', error);
      setFlowchartError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGeneratingFlowchart(false);
    }
  };

  const handleSaveFlowchart = async () => {
    if (!websiteType || !flowchartCode) return;

    const typeInfo = WEBSITE_TYPES.find((t) => t.type === websiteType);
    const summary = getSummaryData();
    if (!summary) return;

    setIsSaving(true);
    try {
      await saveFlowchart({
        title: `${typeInfo?.name || websiteType} - ${getFlowchartTypeLabel(currentFlowchartType)}`,
        websiteType,
        websiteTypeName: typeInfo?.name || websiteType,
        flowchartType: currentFlowchartType,
        selectedFeatures: Array.from(selectedFeatures),
        mermaidCode: flowchartCode,
        summary,
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving flowchart:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFlowchartTypeLabel = (type: FlowchartType) => {
    const found = FLOWCHART_TYPES.find((t) => t.type === type);
    return found?.name || type;
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return websiteType !== null;
      case 2:
        return selectedFeatures.size > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, websiteType, selectedFeatures]);

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const selectedCount = selectedFeatures.size;

  return (
    <div className="page-gradient">
      <div className="container relative z-10 mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/10">
                <Home className="size-4" />
                <span className="hidden sm:inline">หน้าหลัก</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/flowchart/history">
                <Button variant="outline" size="sm" className="gap-2">
                  <History className="size-4" />
                  <span className="hidden sm:inline">ประวัติ Flowchart</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Website Planning Generator
            </h1>
            <p className="text-muted-foreground mt-2">
              สร้างแผนพัฒนาเว็บไซต์แบบ Step-by-Step
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Main Content */}
        <Card className="min-h-[500px]">
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <WebsiteTypeSelector selectedType={websiteType} onSelect={setWebsiteType} />
            )}

            {currentStep === 2 && websiteType && (
              <FeatureSelector
                websiteType={websiteType}
                category="core"
                selectedFeatures={selectedFeatures}
                onToggle={handleToggleFeature}
              />
            )}

            {currentStep === 3 && websiteType && (
              <FeatureSelector
                websiteType={websiteType}
                category="advanced"
                selectedFeatures={selectedFeatures}
                onToggle={handleToggleFeature}
              />
            )}

            {currentStep === 4 && websiteType && (
              <SummaryView
                websiteType={websiteType}
                selectedFeatures={selectedFeatures}
                onGenerateFlowchart={handleGenerateFlowchart}
                isGenerating={isGeneratingFlowchart}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="size-4" />
                ย้อนกลับ
              </Button>
            )}
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
                <RefreshCw className="size-4" />
                เริ่มใหม่
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {selectedCount > 0 && currentStep > 1 && currentStep < 4 && (
              <Badge variant="secondary" className="text-sm">
                เลือกแล้ว {selectedCount} Features
              </Badge>
            )}

            {currentStep < STEPS.length && (
              <Button onClick={handleNext} disabled={!canProceed}>
                {currentStep === 3 ? 'ดูสรุป' : 'ถัดไป'}
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mermaid Viewer Modal */}
      {showFlowchart && (
        <MermaidViewer
          code={flowchartCode}
          onClose={() => setShowFlowchart(false)}
          isLoading={isGeneratingFlowchart}
          error={flowchartError}
          onSave={handleSaveFlowchart}
          isSaving={isSaving}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
