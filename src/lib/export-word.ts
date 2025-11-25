import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import type { GeneratedPlan } from '@/types';
import { formatScopeItem } from '@/lib/scope-utils';

export async function exportToWord(plan: GeneratedPlan, lang: 'en' | 'th'): Promise<void> {
  const sections: Paragraph[] = [];

  // Title
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: plan.projectName,
          bold: true,
          size: 48,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Date
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${lang === 'th' ? 'สร้างเมื่อ' : 'Generated'}: ${new Date(plan.generatedAt).toLocaleDateString(
            lang === 'th' ? 'th-TH' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}`,
          color: '666666',
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // 1. Requirements
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '1. เอกสารความต้องการ' : '1. Requirements Document',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  // Business Requirements
  sections.push(
    new Paragraph({
      text: plan.requirements.business.title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );
  plan.requirements.business.items.forEach((item) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `• ${item}` })],
        spacing: { after: 80 },
      })
    );
  });

  // Functional Requirements
  sections.push(
    new Paragraph({
      text: plan.requirements.functional.title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );
  plan.requirements.functional.items.forEach((item) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `• ${item}` })],
        spacing: { after: 80 },
      })
    );
  });

  // Non-Functional Requirements
  sections.push(
    new Paragraph({
      text: plan.requirements.nonFunctional.title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    })
  );
  plan.requirements.nonFunctional.items.forEach((item) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: `• ${item}` })],
        spacing: { after: 80 },
      })
    );
  });

  // 2. User Personas
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '2. กลุ่มผู้ใช้เป้าหมาย' : '2. User Personas',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  plan.personas.forEach((persona) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${persona.avatar} ${persona.name}`,
            bold: true,
            size: 28,
          }),
          persona.isPrimary
            ? new TextRun({ text: ' (Primary)', italics: true, color: '3B82F6' })
            : new TextRun({ text: '' }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Role: ${persona.role} | Age: ${persona.age} | ${persona.occupation}`, color: '666666' }),
        ],
        spacing: { after: 100 },
      })
    );

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Goals:', bold: true })],
        spacing: { before: 100 },
      })
    );
    persona.goals.forEach((goal) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `  • ${goal}` })],
        })
      );
    });

    sections.push(
      new Paragraph({
        children: [new TextRun({ text: 'Pain Points:', bold: true })],
        spacing: { before: 100 },
      })
    );
    persona.painPoints.forEach((pain) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `  • ${pain}` })],
        })
      );
    });
  });

  // 3. Competitor Analysis
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '3. วิเคราะห์คู่แข่งและ SWOT' : '3. Competitor & SWOT Analysis',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  // SWOT Table
  const swotTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Strengths', bold: true })] })],
            shading: { fill: '22C55E' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Weaknesses', bold: true })] })],
            shading: { fill: 'EF4444' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: plan.competitorAnalysis.swot.strengths.map(
              (s) => new Paragraph({ children: [new TextRun({ text: `• ${s}` })] })
            ),
          }),
          new TableCell({
            children: plan.competitorAnalysis.swot.weaknesses.map(
              (w) => new Paragraph({ children: [new TextRun({ text: `• ${w}` })] })
            ),
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Opportunities', bold: true })] })],
            shading: { fill: '3B82F6' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Threats', bold: true })] })],
            shading: { fill: 'F97316' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: plan.competitorAnalysis.swot.opportunities.map(
              (o) => new Paragraph({ children: [new TextRun({ text: `• ${o}` })] })
            ),
          }),
          new TableCell({
            children: plan.competitorAnalysis.swot.threats.map(
              (t) => new Paragraph({ children: [new TextRun({ text: `• ${t}` })] })
            ),
          }),
        ],
      }),
    ],
  });
  sections.push(new Paragraph({ spacing: { after: 200 } }));
  
  // 4. MoSCoW Scope
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '4. ขอบเขตโปรเจค (MoSCoW)' : '4. Project Scope (MoSCoW)',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  const scopeItems = [
    { title: plan.scope.mustHave.title, items: plan.scope.mustHave.items },
    { title: plan.scope.shouldHave.title, items: plan.scope.shouldHave.items },
    { title: plan.scope.couldHave.title, items: plan.scope.couldHave.items },
    { title: plan.scope.wontHave.title, items: plan.scope.wontHave.items },
  ];

  scopeItems.forEach((scope) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: scope.title, bold: true })],
        spacing: { before: 150, after: 80 },
      })
    );
    scope.items.map(formatScopeItem).forEach((item) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${item}` })],
        })
      );
    });
  });

  // 5. Timeline
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '5. ไทม์ไลน์' : '5. Timeline & Milestones',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${lang === 'th' ? 'ระยะเวลารวม' : 'Total Duration'}: `, bold: true }),
        new TextRun({ text: plan.timeline.totalDuration }),
      ],
      spacing: { after: 200 },
    })
  );

  plan.timeline.phases.forEach((phase) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${phase.name} `, bold: true }),
          new TextRun({ text: `(${phase.duration})`, italics: true, color: '666666' }),
        ],
        spacing: { before: 150, after: 80 },
      })
    );
    sections.push(
      new Paragraph({ children: [new TextRun({ text: 'Tasks:', bold: true })] })
    );
    phase.tasks.forEach((task) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `  • ${task}` })] }));
    });
    sections.push(
      new Paragraph({ children: [new TextRun({ text: 'Deliverables:', bold: true })] })
    );
    phase.deliverables.forEach((d) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `  • ${d}` })] }));
    });
  });

  // 6. Budget
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '6. ประมาณการงบประมาณ' : '6. Budget Estimation',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${lang === 'th' ? 'งบประมาณรวม' : 'Total Budget'}: `, bold: true }),
        new TextRun({ text: plan.budget.totalEstimate, bold: true, color: '3B82F6' }),
      ],
      spacing: { after: 200 },
    })
  );

  const budgetTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Category', bold: true })] })],
            shading: { fill: 'F97316' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
            shading: { fill: 'F97316' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Cost', bold: true })] })],
            shading: { fill: 'F97316' },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '%', bold: true })] })],
            shading: { fill: 'F97316' },
          }),
        ],
      }),
      ...plan.budget.items.map(
        (item) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: item.category })] }),
              new TableCell({ children: [new Paragraph({ text: item.description })] }),
              new TableCell({ children: [new Paragraph({ text: item.estimatedCost })] }),
              new TableCell({ children: [new Paragraph({ text: `${item.percentage}%` })] }),
            ],
          })
      ),
    ],
  });

  // 7. Risk Assessment
  sections.push(
    new Paragraph({
      text: lang === 'th' ? '7. การประเมินความเสี่ยง' : '7. Risk Assessment',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${lang === 'th' ? 'ระดับความเสี่ยงโดยรวม' : 'Overall Risk Level'}: ` }),
        new TextRun({
          text: plan.risks.overallRiskLevel.toUpperCase(),
          bold: true,
          color: plan.risks.overallRiskLevel === 'high' ? 'EF4444' : plan.risks.overallRiskLevel === 'medium' ? 'F97316' : '22C55E',
        }),
      ],
      spacing: { after: 200 },
    })
  );

  plan.risks.risks.forEach((risk) => {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: risk.name, bold: true })],
        spacing: { before: 150, after: 50 },
      })
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Probability: ${risk.probability} | Impact: ${risk.impact} | Category: ${risk.category}`, color: '666666' }),
        ],
      })
    );
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: risk.description })],
      })
    );
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Mitigation: ', bold: true }),
          new TextRun({ text: risk.mitigation }),
        ],
      })
    );
  });

  // Recommendations
  if (plan.risks.recommendations.length > 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: lang === 'th' ? 'คำแนะนำ' : 'Recommendations', bold: true })],
        spacing: { before: 200, after: 100 },
      })
    );
    plan.risks.recommendations.forEach((rec) => {
      sections.push(new Paragraph({ children: [new TextRun({ text: `• ${rec}` })] }));
    });
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        children: [...sections, swotTable, budgetTable],
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  const filename = `${plan.projectName.replace(/[^a-z0-9]/gi, '_')}_plan.docx`;
  saveAs(blob, filename);
}

