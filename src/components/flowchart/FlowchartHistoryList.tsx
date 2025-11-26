'use client';

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
  RefreshCw,
  AlertCircle,
  Plus,
  ShoppingCart,
  FileText,
  Briefcase,
  Cloud,
  Rocket,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  getAllFlowcharts,
  deleteFlowchart,
  clearAllFlowcharts,
  getFlowchartCount,
  type FlowchartHistory,
} from '@/lib/indexeddb';
import { FlowchartHistoryCard } from './FlowchartHistoryCard';
import { FlowchartViewer } from './FlowchartViewer';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';

// ===========================================
// Types
// ===========================================

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'ecommerce' | 'blog' | 'portfolio' | 'saas' | 'landing';

// ===========================================
// Props Interface
// ===========================================

interface FlowchartHistoryListProps {
  onCreateNew?: () => void;
  compact?: boolean;
}

// ===========================================
// Helper Functions
// ===========================================

const filterOptions: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'ทั้งหมด', icon: <GitBranch className="size-4" /> },
  { value: 'ecommerce', label: 'E-Commerce', icon: <ShoppingCart className="size-4" /> },
  { value: 'blog', label: 'Blog', icon: <FileText className="size-4" /> },
  { value: 'portfolio', label: 'Portfolio', icon: <Briefcase className="size-4" /> },
  { value: 'saas', label: 'SaaS', icon: <Cloud className="size-4" /> },
  { value: 'landing', label: 'Landing', icon: <Rocket className="size-4" /> },
];

// ===========================================
// Component
// ===========================================

export function FlowchartHistoryList({
  onCreateNew,
  compact = false,
}: FlowchartHistoryListProps) {
  const [flowcharts, setFlowcharts] = useState<FlowchartHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showFilter, setShowFilter] = useState(false);
  
  // Viewer state
  const [selectedFlowchart, setSelectedFlowchart] = useState<FlowchartHistory | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Delete state
  const [flowchartToDelete, setFlowchartToDelete] = useState<FlowchartHistory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load flowcharts
  const loadFlowcharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFlowcharts();
      setFlowcharts(data);
    } catch (err) {
      console.error('Error loading flowcharts:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlowcharts();
  }, []);

  // Filter flowcharts
  const filteredFlowcharts = flowcharts.filter((f) => {
    // Apply type filter
    if (filter !== 'all' && f.websiteType !== filter) {
      return false;
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(query) ||
        f.websiteTypeName.toLowerCase().includes(query) ||
        f.flowchartType.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Handlers
  const handleView = (flowchart: FlowchartHistory) => {
    setSelectedFlowchart(flowchart);
    setIsViewerOpen(true);
  };

  // Handle flowchart update from viewer
  const handleUpdate = (updatedFlowchart: FlowchartHistory) => {
    setFlowcharts((prev) =>
      prev.map((f) => (f.id === updatedFlowchart.id ? updatedFlowchart : f))
    );
    setSelectedFlowchart(updatedFlowchart);
  };

  const handleDeleteClick = (flowchart: FlowchartHistory) => {
    setFlowchartToDelete(flowchart);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!flowchartToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteFlowchart(flowchartToDelete.id);
      setFlowcharts((prev) => prev.filter((f) => f.id !== flowchartToDelete.id));
      setIsDeleteDialogOpen(false);
      setFlowchartToDelete(null);
      
      // Close viewer if deleted flowchart is being viewed
      if (selectedFlowchart?.id === flowchartToDelete.id) {
        setIsViewerOpen(false);
        setSelectedFlowchart(null);
      }
    } catch (err) {
      console.error('Error deleting flowchart:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      await clearAllFlowcharts();
      setFlowcharts([]);
      setIsClearAllDialogOpen(false);
      setIsViewerOpen(false);
      setSelectedFlowchart(null);
    } catch (err) {
      console.error('Error clearing flowcharts:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const stats = {
    total: flowcharts.length,
    byType: filterOptions.slice(1).map((opt) => ({
      ...opt,
      count: flowcharts.filter((f) => f.websiteType === opt.value).length,
    })),
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <GitBranch className="size-5" />
            Flowchart ล่าสุด
          </h3>
          {onCreateNew && (
            <Button size="sm" onClick={onCreateNew}>
              <Plus className="size-4" />
              สร้างใหม่
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="size-6 animate-spin mx-auto mb-2" />
            <p>กำลังโหลด...</p>
          </div>
        ) : flowcharts.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <GitBranch className="size-12 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">ยังไม่มี Flowchart</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {flowcharts.slice(0, 5).map((flowchart) => (
              <FlowchartHistoryCard
                key={flowchart.id}
                flowchart={flowchart}
                onView={handleView}
                onDelete={handleDeleteClick}
                compact
              />
            ))}
          </div>
        )}

        {/* Viewer */}
        <FlowchartViewer
          flowchart={selectedFlowchart}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          onUpdate={handleUpdate}
          onDelete={handleDeleteClick}
        />

        {/* Delete Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="ลบ Flowchart"
          description={`คุณต้องการลบ "${flowchartToDelete?.title}" หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
          isDeleting={isDeleting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="size-6 text-primary" />
            Flowchart History
          </h2>
          <p className="text-muted-foreground mt-1">
            ประวัติ Flowchart ที่สร้างไว้ทั้งหมด ({stats.total} รายการ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="size-4" />
              สร้าง Flowchart ใหม่
            </Button>
          )}
          {flowcharts.length > 0 && (
            <Button variant="outline" className="text-red-600" onClick={() => setIsClearAllDialogOpen(true)}>
              <Trash2 className="size-4" />
              ลบทั้งหมด
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {filterOptions.map((opt) => {
          const count = opt.value === 'all' ? stats.total : stats.byType.find((s) => s.value === opt.value)?.count || 0;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`p-3 rounded-lg border text-center transition-all ${
                filter === opt.value
                  ? 'border-primary bg-primary/10'
                  : 'hover:border-primary/50'
              }`}
            >
              <div className={`flex justify-center mb-1 ${filter === opt.value ? 'text-primary' : 'text-muted-foreground'}`}>
                {opt.icon}
              </div>
              <div className="text-lg font-semibold">{count}</div>
              <div className="text-xs text-muted-foreground">{opt.label}</div>
            </button>
          );
        })}
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา Flowchart..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="size-8"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="size-8"
            onClick={() => setViewMode('list')}
          >
            <List className="size-4" />
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={loadFlowcharts}>
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">
          <RefreshCw className="size-8 animate-spin mx-auto mb-3" />
          <p>กำลังโหลด...</p>
        </div>
      ) : error ? (
        <Card className="text-center py-16">
          <CardContent>
            <AlertCircle className="size-12 mx-auto text-red-500 mb-3" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadFlowcharts}>
              <RefreshCw className="size-4" />
              ลองใหม่
            </Button>
          </CardContent>
        </Card>
      ) : filteredFlowcharts.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <GitBranch className="size-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || filter !== 'all' ? 'ไม่พบ Flowchart ที่ตรงกับเงื่อนไข' : 'ยังไม่มี Flowchart'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filter !== 'all'
                ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                : 'เริ่มสร้าง Flowchart แรกของคุณ'}
            </p>
            {onCreateNew && !searchQuery && filter === 'all' && (
              <Button onClick={onCreateNew}>
                <Plus className="size-4" />
                สร้าง Flowchart ใหม่
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredFlowcharts.map((flowchart) => (
            <FlowchartHistoryCard
              key={flowchart.id}
              flowchart={flowchart}
              onView={handleView}
              onDelete={handleDeleteClick}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}

      {/* Viewer */}
      <FlowchartViewer
        flowchart={selectedFlowchart}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        onUpdate={handleUpdate}
        onDelete={handleDeleteClick}
      />

      {/* Delete Single Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="ลบ Flowchart"
        description={`คุณต้องการลบ "${flowchartToDelete?.title}" หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        isDeleting={isDeleting}
      />

      {/* Clear All Dialog */}
      <DeleteConfirmationDialog
        open={isClearAllDialogOpen}
        onOpenChange={setIsClearAllDialogOpen}
        onConfirm={handleClearAll}
        title="ลบ Flowchart ทั้งหมด"
        description={`คุณต้องการลบ Flowchart ทั้งหมด (${stats.total} รายการ) หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้`}
        isDeleting={isDeleting}
        type="all"
      />
    </div>
  );
}

export default FlowchartHistoryList;

