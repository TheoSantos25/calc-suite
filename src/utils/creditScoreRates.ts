import { createElement } from 'react'

// ---------------------------------------------------------------------------
// Credit Tier
// ---------------------------------------------------------------------------

export type CreditTier = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export function getCreditTier(score: number): CreditTier {
  if (score >= 750) return 'Excellent'
  if (score >= 700) return 'Good'
  if (score >= 650) return 'Fair'
  return 'Poor'
}

export const CREDIT_TIER_COLORS: Record<CreditTier, string> = {
  Excellent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Fair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

// ---------------------------------------------------------------------------
// Rate Suggestions
// ---------------------------------------------------------------------------

export interface RateSuggestion {
  min: number
  max: number
  typical: number
}

export type LoanType =
  | 'mortgage30'
  | 'mortgage15'
  | 'autoNew'
  | 'autoUsed'
  | 'personal'
  | 'creditCard'

const RATE_TABLE: Record<LoanType, Record<CreditTier, RateSuggestion>> = {
  mortgage30: {
    Excellent: { min: 5.8, max: 6.5, typical: 6.15 },
    Good: { min: 6.5, max: 7.2, typical: 6.85 },
    Fair: { min: 7.2, max: 8.5, typical: 7.85 },
    Poor: { min: 8.5, max: 10.5, typical: 9.5 },
  },
  mortgage15: {
    Excellent: { min: 5.3, max: 6.0, typical: 5.65 },
    Good: { min: 6.0, max: 6.7, typical: 6.35 },
    Fair: { min: 6.7, max: 8.0, typical: 7.35 },
    Poor: { min: 8.0, max: 10.0, typical: 9.0 },
  },
  autoNew: {
    Excellent: { min: 4.5, max: 5.5, typical: 5.0 },
    Good: { min: 5.5, max: 7.5, typical: 6.5 },
    Fair: { min: 7.5, max: 11, typical: 9.25 },
    Poor: { min: 11, max: 18, typical: 14.5 },
  },
  autoUsed: {
    Excellent: { min: 6.0, max: 7.0, typical: 6.5 },
    Good: { min: 7.0, max: 9.0, typical: 8.0 },
    Fair: { min: 9.0, max: 12.5, typical: 10.75 },
    Poor: { min: 12.5, max: 19.5, typical: 16.0 },
  },
  personal: {
    Excellent: { min: 7, max: 10, typical: 8.5 },
    Good: { min: 10, max: 15, typical: 12.5 },
    Fair: { min: 15, max: 22, typical: 18.5 },
    Poor: { min: 22, max: 30, typical: 26 },
  },
  creditCard: {
    Excellent: { min: 14, max: 18, typical: 16 },
    Good: { min: 18, max: 22, typical: 20 },
    Fair: { min: 22, max: 26, typical: 24 },
    Poor: { min: 26, max: 30, typical: 28 },
  },
}

export function getSuggestedRate(
  score: number,
  loanType: LoanType,
): RateSuggestion {
  const tier = getCreditTier(score)
  return RATE_TABLE[loanType][tier]
}

// ---------------------------------------------------------------------------
// CreditScoreBadge Component
// ---------------------------------------------------------------------------

export function CreditScoreBadge({ score }: { score: number }) {
  const tier = getCreditTier(score)
  const colorClasses = CREDIT_TIER_COLORS[tier]
  return createElement(
    'span',
    {
      className: `inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClasses}`,
    },
    `${tier} (${score})`,
  )
}
