import type { ScopeItem, DetailedScopeItem } from '@/types';

export function isDetailedScopeItem(item: ScopeItem): item is DetailedScopeItem {
  return typeof item === 'object' && item !== null && 'feature' in item;
}

export function formatScopeItem(item: ScopeItem): string {
  if (!isDetailedScopeItem(item)) {
    return item;
  }

  const requirements = Array.isArray(item.requirements) ? item.requirements : [];
  const requirementText = requirements.length ? `: ${requirements.join('; ')}` : '';
  const descriptionText = !requirements.length && item.description ? `: ${item.description}` : '';
  const notesText = !requirements.length && !item.description && item.notes ? `: ${item.notes}` : '';

  return `${item.feature}${requirementText || descriptionText || notesText}`;
}

