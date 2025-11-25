'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  labels: { en: string; th: string }[];
  lang: 'en' | 'th';
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export function WizardProgress({ 
  currentStep, 
  totalSteps, 
  labels, 
  lang,
  onStepClick,
  canNavigateToStep
}: WizardProgressProps) {
  const handleStepClick = (step: number) => {
    if (onStepClick && canNavigateToStep && canNavigateToStep(step)) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10" />
        
        {/* Progress line active */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const canNavigate = canNavigateToStep ? canNavigateToStep(step) : true;
          const isClickable = onStepClick && canNavigate;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                onClick={() => handleStepClick(step)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-sm',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                  isClickable && 'cursor-pointer hover:scale-110 hover:ring-2 hover:ring-primary/30',
                  !isClickable && 'cursor-not-allowed opacity-60'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <span
                onClick={() => handleStepClick(step)}
                className={cn(
                  'text-xs font-medium transition-colors hidden sm:block',
                  (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground',
                  isClickable && 'cursor-pointer hover:text-foreground'
                )}
              >
                {labels[i]?.[lang] || `Step ${step}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

