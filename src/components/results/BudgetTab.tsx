'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Wallet, Info, TrendingUp } from 'lucide-react';
import type { BudgetEstimation } from '@/types';

interface BudgetTabProps {
  budget: BudgetEstimation;
  lang: 'en' | 'th';
}

const categoryColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-yellow-500',
  'bg-red-500',
];

export function BudgetTab({ budget, lang }: BudgetTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">
          {lang === 'th' ? 'ประมาณการงบประมาณ' : 'Budget Estimation'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'th'
            ? 'การแบ่งงบประมาณตามหมวดหมู่'
            : 'Budget breakdown by category'}
        </p>
      </div>

      {/* Total Budget Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {lang === 'th' ? 'งบประมาณรวมทั้งหมด' : 'Total Estimated Budget'}
              </p>
              <p className="text-3xl font-bold text-primary">
                {budget.totalEstimate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Chart Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="w-5 h-5" />
            {lang === 'th' ? 'สัดส่วนงบประมาณ' : 'Budget Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress bar visualization */}
          <div className="h-8 rounded-full overflow-hidden flex mb-4">
            {budget.items.map((item, index) => (
              <div
                key={index}
                className={`${categoryColors[index % categoryColors.length]} transition-all`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {budget.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className={`w-3 h-3 rounded-full ${categoryColors[index % categoryColors.length]}`} />
                <span className="truncate">{item.category}</span>
                <span className="text-muted-foreground">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Items Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5" />
            {lang === 'th' ? 'รายละเอียดงบประมาณ' : 'Budget Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'หมวดหมู่' : 'Category'}
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'รายละเอียด' : 'Description'}
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">
                    {lang === 'th' ? 'ประมาณการ' : 'Estimate'}
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${categoryColors[index % categoryColors.length]}`} />
                        <span className="font-medium text-sm">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {item.description}
                    </td>
                    <td className="py-3 px-2 text-right text-sm font-medium">
                      {item.estimatedCost}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={2} className="py-3 px-2 font-semibold">
                    {lang === 'th' ? 'รวมทั้งหมด' : 'Total'}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-primary">
                    {budget.totalEstimate}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Badge>100%</Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {budget.notes && budget.notes.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-5 h-5" />
              {lang === 'th' ? 'หมายเหตุ' : 'Notes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {budget.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

