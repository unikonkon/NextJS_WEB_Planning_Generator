'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowchartHistoryList } from '@/components/flowchart';

export default function FlowchartHistoryPage() {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push('/flowchart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/flowchart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4" />
              กลับไปสร้าง Flowchart
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
            <GitBranch className="size-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Flowchart History
          </h1>
          <p className="text-muted-foreground mt-2">
            ดู จัดการ และแก้ไข Flowchart ที่สร้างไว้
          </p>
        </div>

        {/* History List */}
        <FlowchartHistoryList onCreateNew={handleCreateNew} />
      </div>
    </div>
  );
}

