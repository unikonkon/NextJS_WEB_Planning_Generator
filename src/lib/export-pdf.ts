import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { GeneratedPlan } from '@/types';
import { formatScopeItem } from '@/lib/scope-utils';

// Note: For Thai font support, you'd need to add a Thai font file
// This is a basic implementation that works with English text
// For production Thai support, you'd need to:
// 1. Download a Thai font (e.g., THSarabunNew)
// 2. Convert it to base64
// 3. Add it using doc.addFileToVFS() and doc.addFont()

export async function exportToPDF(plan: GeneratedPlan, lang: 'en' | 'th'): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Helper function to add a new page if needed
  const checkPageBreak = (height: number) => {
    if (yPos + height > 270) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(plan.projectName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128);
  const dateText = lang === 'th' 
    ? `Generated: ${new Date(plan.generatedAt).toLocaleDateString('th-TH')}`
    : `Generated: ${new Date(plan.generatedAt).toLocaleDateString('en-US')}`;
  doc.text(dateText, pageWidth / 2, yPos, { align: 'center' });
  doc.setTextColor(0);
  yPos += 15;

  // 1. Requirements
  checkPageBreak(60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '1. Requirements' : '1. Requirements Document', 14, yPos);
  yPos += 8;

  // Business Requirements
  doc.setFontSize(11);
  doc.text(plan.requirements.business.title, 14, yPos);
  yPos += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  plan.requirements.business.items.forEach((item) => {
    checkPageBreak(8);
    const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
    doc.text(lines, 18, yPos);
    yPos += lines.length * 5 + 2;
  });
  yPos += 5;

  // Functional Requirements
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(plan.requirements.functional.title, 14, yPos);
  yPos += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  plan.requirements.functional.items.forEach((item) => {
    checkPageBreak(8);
    const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
    doc.text(lines, 18, yPos);
    yPos += lines.length * 5 + 2;
  });
  yPos += 5;

  // Non-Functional Requirements
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(plan.requirements.nonFunctional.title, 14, yPos);
  yPos += 6;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  plan.requirements.nonFunctional.items.forEach((item) => {
    checkPageBreak(8);
    const lines = doc.splitTextToSize(`• ${item}`, pageWidth - 28);
    doc.text(lines, 18, yPos);
    yPos += lines.length * 5 + 2;
  });
  yPos += 10;

  // 2. User Personas
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '2. User Personas' : '2. User Personas', 14, yPos);
  yPos += 10;

  plan.personas.forEach((persona) => {
    checkPageBreak(50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${persona.avatar} ${persona.name} ${persona.isPrimary ? '(Primary)' : ''}`, 14, yPos);
    yPos += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Role: ${persona.role} | Age: ${persona.age} | ${persona.occupation}`, 14, yPos);
    yPos += 6;
    doc.text(`Tech Savviness: ${persona.techSavviness}`, 14, yPos);
    yPos += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Goals:', 14, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    persona.goals.forEach((goal) => {
      const lines = doc.splitTextToSize(`• ${goal}`, pageWidth - 28);
      doc.text(lines, 18, yPos);
      yPos += lines.length * 5;
    });
    yPos += 3;

    doc.setFont('helvetica', 'bold');
    doc.text('Pain Points:', 14, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    persona.painPoints.forEach((pain) => {
      const lines = doc.splitTextToSize(`• ${pain}`, pageWidth - 28);
      doc.text(lines, 18, yPos);
      yPos += lines.length * 5;
    });
    yPos += 10;
  });

  // 3. SWOT Analysis
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '3. SWOT Analysis' : '3. Competitor & SWOT Analysis', 14, yPos);
  yPos += 10;

  const swotData = [
    ['Strengths', plan.competitorAnalysis.swot.strengths.join('\n')],
    ['Weaknesses', plan.competitorAnalysis.swot.weaknesses.join('\n')],
    ['Opportunities', plan.competitorAnalysis.swot.opportunities.join('\n')],
    ['Threats', plan.competitorAnalysis.swot.threats.join('\n')],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Category', 'Items']],
    body: swotData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
  });

  // 4. MoSCoW Scope
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '4. Project Scope (MoSCoW)' : '4. Project Scope (MoSCoW)', 14, yPos);
  yPos += 10;

  const scopeData = [
    ['Must Have', plan.scope.mustHave.items.map(formatScopeItem).join('\n')],
    ['Should Have', plan.scope.shouldHave.items.map(formatScopeItem).join('\n')],
    ['Could Have', plan.scope.couldHave.items.map(formatScopeItem).join('\n')],
    ["Won't Have", plan.scope.wontHave.items.map(formatScopeItem).join('\n')],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Priority', 'Features']],
    body: scopeData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
  });

  // 5. Timeline
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '5. Timeline' : '5. Timeline & Milestones', 14, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Duration: ${plan.timeline.totalDuration}`, 14, yPos);
  yPos += 8;

  const timelineData = plan.timeline.phases.map((phase) => [
    phase.name,
    phase.duration,
    phase.tasks.join('\n'),
    phase.deliverables.join('\n'),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Phase', 'Duration', 'Tasks', 'Deliverables']],
    body: timelineData,
    theme: 'grid',
    headStyles: { fillColor: [168, 85, 247] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 45 },
    },
  });

  // 6. Budget
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '6. Budget' : '6. Budget Estimation', 14, yPos);
  yPos += 8;
  doc.setFontSize(12);
  doc.text(`Total: ${plan.budget.totalEstimate}`, 14, yPos);
  yPos += 10;

  const budgetData = plan.budget.items.map((item) => [
    item.category,
    item.description,
    item.estimatedCost,
    `${item.percentage}%`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Category', 'Description', 'Cost', '%']],
    body: budgetData,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
  });

  // 7. Risk Assessment
  doc.addPage();
  yPos = 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(lang === 'th' ? '7. Risk Assessment' : '7. Risk Assessment', 14, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Risk Level: ${plan.risks.overallRiskLevel.toUpperCase()}`, 14, yPos);
  yPos += 10;

  const riskData = plan.risks.risks.map((risk) => [
    risk.name,
    risk.probability,
    risk.impact,
    risk.category,
    risk.mitigation,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Risk', 'Probability', 'Impact', 'Category', 'Mitigation']],
    body: riskData,
    theme: 'grid',
    headStyles: { fillColor: [239, 68, 68] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 22 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 'auto' },
    },
  });

  // Save the PDF
  const filename = `${plan.projectName.replace(/[^a-z0-9]/gi, '_')}_plan.pdf`;
  doc.save(filename);
}

