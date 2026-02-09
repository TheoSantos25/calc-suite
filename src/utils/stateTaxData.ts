// State tax data - 2024 tax year
// Sources: Tax Foundation, state revenue departments

export const TAX_DATA_YEAR = 2024

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
] as const

interface TaxBracket {
  limit: number
  rate: number // decimal, e.g. 0.05 = 5%
}

interface StateTaxConfig {
  type: 'none' | 'flat' | 'progressive'
  rate?: number // for flat-rate states (decimal)
  brackets?: TaxBracket[] // for progressive states (same for single/married simplified)
  standardDeduction?: number
}

const STATE_INCOME_TAX: Record<string, StateTaxConfig> = {
  // No income tax states
  AK: { type: 'none' },
  FL: { type: 'none' },
  NV: { type: 'none' },
  NH: { type: 'none' }, // no wage tax (interest/dividends only, phasing out)
  SD: { type: 'none' },
  TN: { type: 'none' },
  TX: { type: 'none' },
  WA: { type: 'none' },
  WY: { type: 'none' },

  // Flat-rate states
  CO: { type: 'flat', rate: 0.044, standardDeduction: 14600 },
  IL: { type: 'flat', rate: 0.0495, standardDeduction: 0 },
  IN: { type: 'flat', rate: 0.0305, standardDeduction: 0 },
  KY: { type: 'flat', rate: 0.04, standardDeduction: 3160 },
  MA: { type: 'flat', rate: 0.05, standardDeduction: 0 },
  MI: { type: 'flat', rate: 0.0425, standardDeduction: 5400 },
  NC: { type: 'flat', rate: 0.0475, standardDeduction: 12750 },
  PA: { type: 'flat', rate: 0.0307, standardDeduction: 0 },
  UT: { type: 'flat', rate: 0.0465, standardDeduction: 0 },

  // Progressive states - top 10 most populous with accurate brackets
  CA: {
    type: 'progressive',
    standardDeduction: 5363,
    brackets: [
      { limit: 10412, rate: 0.01 },
      { limit: 24684, rate: 0.02 },
      { limit: 38959, rate: 0.04 },
      { limit: 54081, rate: 0.06 },
      { limit: 68350, rate: 0.08 },
      { limit: 349137, rate: 0.093 },
      { limit: 418961, rate: 0.103 },
      { limit: 698271, rate: 0.113 },
      { limit: 1000000, rate: 0.123 },
      { limit: Infinity, rate: 0.133 },
    ],
  },
  NY: {
    type: 'progressive',
    standardDeduction: 8000,
    brackets: [
      { limit: 8500, rate: 0.04 },
      { limit: 11700, rate: 0.045 },
      { limit: 13900, rate: 0.0525 },
      { limit: 80650, rate: 0.0585 },
      { limit: 215400, rate: 0.0625 },
      { limit: 1077550, rate: 0.0685 },
      { limit: 5000000, rate: 0.0965 },
      { limit: 25000000, rate: 0.103 },
      { limit: Infinity, rate: 0.109 },
    ],
  },
  NJ: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 20000, rate: 0.014 },
      { limit: 35000, rate: 0.0175 },
      { limit: 40000, rate: 0.035 },
      { limit: 75000, rate: 0.05525 },
      { limit: 500000, rate: 0.0637 },
      { limit: 1000000, rate: 0.0897 },
      { limit: Infinity, rate: 0.1075 },
    ],
  },
  GA: {
    type: 'progressive',
    standardDeduction: 5400,
    brackets: [
      { limit: 750, rate: 0.01 },
      { limit: 2250, rate: 0.02 },
      { limit: 3750, rate: 0.03 },
      { limit: 5250, rate: 0.04 },
      { limit: 7000, rate: 0.05 },
      { limit: Infinity, rate: 0.055 },
    ],
  },
  VA: {
    type: 'progressive',
    standardDeduction: 4500,
    brackets: [
      { limit: 3000, rate: 0.02 },
      { limit: 5000, rate: 0.03 },
      { limit: 17000, rate: 0.05 },
      { limit: Infinity, rate: 0.0575 },
    ],
  },
  OH: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 26050, rate: 0 },
      { limit: 100000, rate: 0.02765 },
      { limit: Infinity, rate: 0.035 },
    ],
  },
  MN: {
    type: 'progressive',
    standardDeduction: 14575,
    brackets: [
      { limit: 30070, rate: 0.0535 },
      { limit: 98760, rate: 0.068 },
      { limit: 183340, rate: 0.0785 },
      { limit: Infinity, rate: 0.0985 },
    ],
  },
  OR: {
    type: 'progressive',
    standardDeduction: 2745,
    brackets: [
      { limit: 4050, rate: 0.0475 },
      { limit: 10200, rate: 0.0675 },
      { limit: 125000, rate: 0.0875 },
      { limit: Infinity, rate: 0.099 },
    ],
  },
  WI: {
    type: 'progressive',
    standardDeduction: 12760,
    brackets: [
      { limit: 14320, rate: 0.0354 },
      { limit: 28640, rate: 0.0465 },
      { limit: 315310, rate: 0.053 },
      { limit: Infinity, rate: 0.0765 },
    ],
  },
  SC: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 3460, rate: 0 },
      { limit: 17330, rate: 0.03 },
      { limit: Infinity, rate: 0.064 },
    ],
  },

  // Remaining progressive states - simplified 3-bracket approximation
  AL: {
    type: 'progressive',
    standardDeduction: 2500,
    brackets: [
      { limit: 500, rate: 0.02 },
      { limit: 3000, rate: 0.04 },
      { limit: Infinity, rate: 0.05 },
    ],
  },
  AZ: {
    type: 'flat',
    rate: 0.025,
    standardDeduction: 14600,
  },
  AR: {
    type: 'progressive',
    standardDeduction: 2340,
    brackets: [
      { limit: 4400, rate: 0.02 },
      { limit: 8800, rate: 0.04 },
      { limit: Infinity, rate: 0.044 },
    ],
  },
  CT: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 10000, rate: 0.03 },
      { limit: 50000, rate: 0.05 },
      { limit: 100000, rate: 0.055 },
      { limit: 200000, rate: 0.06 },
      { limit: 250000, rate: 0.065 },
      { limit: 500000, rate: 0.069 },
      { limit: Infinity, rate: 0.0699 },
    ],
  },
  DE: {
    type: 'progressive',
    standardDeduction: 3250,
    brackets: [
      { limit: 2000, rate: 0 },
      { limit: 5000, rate: 0.022 },
      { limit: 10000, rate: 0.039 },
      { limit: 20000, rate: 0.048 },
      { limit: 25000, rate: 0.052 },
      { limit: 60000, rate: 0.0555 },
      { limit: Infinity, rate: 0.066 },
    ],
  },
  HI: {
    type: 'progressive',
    standardDeduction: 2200,
    brackets: [
      { limit: 2400, rate: 0.014 },
      { limit: 4800, rate: 0.032 },
      { limit: 9600, rate: 0.055 },
      { limit: 14400, rate: 0.064 },
      { limit: 19200, rate: 0.068 },
      { limit: 24000, rate: 0.072 },
      { limit: 36000, rate: 0.076 },
      { limit: 48000, rate: 0.079 },
      { limit: 150000, rate: 0.0825 },
      { limit: 175000, rate: 0.09 },
      { limit: 200000, rate: 0.10 },
      { limit: Infinity, rate: 0.11 },
    ],
  },
  ID: {
    type: 'flat',
    rate: 0.058,
    standardDeduction: 14600,
  },
  IA: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 6210, rate: 0.044 },
      { limit: 31050, rate: 0.0482 },
      { limit: Infinity, rate: 0.06 },
    ],
  },
  KS: {
    type: 'progressive',
    standardDeduction: 3500,
    brackets: [
      { limit: 15000, rate: 0.031 },
      { limit: 30000, rate: 0.0525 },
      { limit: Infinity, rate: 0.057 },
    ],
  },
  LA: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 12500, rate: 0.0185 },
      { limit: 50000, rate: 0.035 },
      { limit: Infinity, rate: 0.0425 },
    ],
  },
  ME: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 24500, rate: 0.058 },
      { limit: 58050, rate: 0.0675 },
      { limit: Infinity, rate: 0.0715 },
    ],
  },
  MD: {
    type: 'progressive',
    standardDeduction: 2550,
    brackets: [
      { limit: 1000, rate: 0.02 },
      { limit: 2000, rate: 0.03 },
      { limit: 3000, rate: 0.04 },
      { limit: 100000, rate: 0.0475 },
      { limit: 125000, rate: 0.05 },
      { limit: 150000, rate: 0.0525 },
      { limit: 250000, rate: 0.055 },
      { limit: Infinity, rate: 0.0575 },
    ],
  },
  MS: {
    type: 'progressive',
    standardDeduction: 2300,
    brackets: [
      { limit: 5000, rate: 0 },
      { limit: 10000, rate: 0.04 },
      { limit: Infinity, rate: 0.05 },
    ],
  },
  MO: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 1207, rate: 0.02 },
      { limit: 2414, rate: 0.025 },
      { limit: 3621, rate: 0.03 },
      { limit: 4828, rate: 0.035 },
      { limit: 6035, rate: 0.04 },
      { limit: 7242, rate: 0.045 },
      { limit: 8449, rate: 0.05 },
      { limit: Infinity, rate: 0.048 },
    ],
  },
  MT: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 20500, rate: 0.047 },
      { limit: Infinity, rate: 0.059 },
    ],
  },
  NE: {
    type: 'progressive',
    standardDeduction: 7900,
    brackets: [
      { limit: 3700, rate: 0.0246 },
      { limit: 22170, rate: 0.0351 },
      { limit: 35730, rate: 0.0501 },
      { limit: Infinity, rate: 0.0584 },
    ],
  },
  NM: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 5500, rate: 0.017 },
      { limit: 11000, rate: 0.032 },
      { limit: 16000, rate: 0.047 },
      { limit: 210000, rate: 0.049 },
      { limit: Infinity, rate: 0.059 },
    ],
  },
  ND: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 44725, rate: 0.0195 },
      { limit: Infinity, rate: 0.025 },
    ],
  },
  OK: {
    type: 'progressive',
    standardDeduction: 6350,
    brackets: [
      { limit: 1000, rate: 0.0025 },
      { limit: 2500, rate: 0.0075 },
      { limit: 3750, rate: 0.0175 },
      { limit: 4900, rate: 0.0275 },
      { limit: 7200, rate: 0.0375 },
      { limit: Infinity, rate: 0.0475 },
    ],
  },
  RI: {
    type: 'progressive',
    standardDeduction: 10550,
    brackets: [
      { limit: 73450, rate: 0.0375 },
      { limit: 166950, rate: 0.0475 },
      { limit: Infinity, rate: 0.0599 },
    ],
  },
  VT: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 45400, rate: 0.0335 },
      { limit: 110050, rate: 0.066 },
      { limit: 229550, rate: 0.076 },
      { limit: Infinity, rate: 0.0875 },
    ],
  },
  WV: {
    type: 'progressive',
    standardDeduction: 0,
    brackets: [
      { limit: 10000, rate: 0.0236 },
      { limit: 25000, rate: 0.0315 },
      { limit: 40000, rate: 0.0354 },
      { limit: 60000, rate: 0.0472 },
      { limit: Infinity, rate: 0.0512 },
    ],
  },
  DC: {
    type: 'progressive',
    standardDeduction: 14600,
    brackets: [
      { limit: 10000, rate: 0.04 },
      { limit: 40000, rate: 0.06 },
      { limit: 60000, rate: 0.065 },
      { limit: 250000, rate: 0.085 },
      { limit: 500000, rate: 0.0925 },
      { limit: 1000000, rate: 0.0975 },
      { limit: Infinity, rate: 0.1075 },
    ],
  },
}

// Average effective property tax rates by state (%)
const STATE_PROPERTY_TAX_RATES: Record<string, number> = {
  AL: 0.41, AK: 1.19, AZ: 0.62, AR: 0.62, CA: 0.74,
  CO: 0.51, CT: 2.15, DE: 0.57, FL: 0.89, GA: 0.92,
  HI: 0.28, ID: 0.69, IL: 2.27, IN: 0.85, IA: 1.57,
  KS: 1.41, KY: 0.86, LA: 0.55, ME: 1.36, MD: 1.09,
  MA: 1.23, MI: 1.54, MN: 1.12, MS: 0.81, MO: 0.97,
  MT: 0.84, NE: 1.73, NV: 0.60, NH: 2.18, NJ: 2.47,
  NM: 0.80, NY: 1.72, NC: 0.84, ND: 0.98, OH: 1.56,
  OK: 0.90, OR: 0.97, PA: 1.58, RI: 1.63, SC: 0.57,
  SD: 1.31, TN: 0.71, TX: 1.80, UT: 0.63, VT: 1.90,
  VA: 0.82, WA: 1.03, WV: 0.58, WI: 1.85, WY: 0.61,
  DC: 0.56,
}

// State-level sales tax rates (%)
const STATE_SALES_TAX_RATES: Record<string, number> = {
  AL: 4.0, AK: 0, AZ: 5.6, AR: 6.5, CA: 7.25,
  CO: 2.9, CT: 6.35, DE: 0, FL: 6.0, GA: 4.0,
  HI: 4.0, ID: 6.0, IL: 6.25, IN: 7.0, IA: 6.0,
  KS: 6.5, KY: 6.0, LA: 4.45, ME: 5.5, MD: 6.0,
  MA: 6.25, MI: 6.0, MN: 6.875, MS: 7.0, MO: 4.225,
  MT: 0, NE: 5.5, NV: 6.85, NH: 0, NJ: 6.625,
  NM: 5.0, NY: 4.0, NC: 4.75, ND: 5.0, OH: 5.75,
  OK: 4.5, OR: 0, PA: 6.0, RI: 7.0, SC: 6.0,
  SD: 4.5, TN: 7.0, TX: 6.25, UT: 6.1, VT: 6.0,
  VA: 5.3, WA: 6.5, WV: 6.0, WI: 5.0, WY: 4.0,
  DC: 6.0,
}

function applyBrackets(taxableIncome: number, brackets: TaxBracket[]): number {
  let tax = 0
  let remaining = taxableIncome
  let prevLimit = 0

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(remaining, bracket.limit - prevLimit)
    if (taxableInBracket <= 0) break
    tax += taxableInBracket * bracket.rate
    remaining -= taxableInBracket
    prevLimit = bracket.limit
  }

  return tax
}

export function calculateStateTax(
  grossIncome: number,
  stateCode: string,
  _filingStatus: 'single' | 'married',
): number {
  const config = STATE_INCOME_TAX[stateCode]
  if (!config || config.type === 'none') return 0

  const deduction = config.standardDeduction ?? 0
  const taxableIncome = Math.max(0, grossIncome - deduction)

  if (config.type === 'flat') {
    return taxableIncome * (config.rate ?? 0)
  }

  if (config.type === 'progressive' && config.brackets) {
    return applyBrackets(taxableIncome, config.brackets)
  }

  return 0
}

export function getStatePropertyTaxRate(stateCode: string): number {
  return STATE_PROPERTY_TAX_RATES[stateCode] ?? 1.1
}

export function getStateSalesTaxRate(stateCode: string): number {
  return STATE_SALES_TAX_RATES[stateCode] ?? 0
}
