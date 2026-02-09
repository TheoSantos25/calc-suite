/**
 * Purchasing Power Parity data based on World Bank / IMF estimates.
 * PPP factor = how many local currency units buy the same basket of goods as 1 USD in the US.
 * costOfLiving: approximate prices in local currency for common items.
 */

export interface CostItem {
  label: string
  icon: string
  localPrice: number   // in local currency
}

export interface PPPCountry {
  currency: string
  country: string
  flag: string
  pppFactor: number       // PPP conversion factor (local currency per international dollar)
  costOfLiving: CostItem[]
}

// PPP factors: local currency units per 1 international dollar (purchasing power equivalent)
// Source: World Bank International Comparison Program, ~2024 estimates
export const pppData: Record<string, PPPCountry> = {
  USD: {
    currency: 'USD',
    country: 'United States',
    flag: 'US',
    pppFactor: 1.0,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 5.50 },
      { label: 'Meal Out', icon: 'meal', localPrice: 18.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 1800 },
      { label: 'Public Transit', icon: 'transit', localPrice: 2.75 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 85 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 15 },
    ],
  },
  EUR: {
    currency: 'EUR',
    country: 'Germany',
    flag: 'DE',
    pppFactor: 0.78,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 3.50 },
      { label: 'Meal Out', icon: 'meal', localPrice: 14.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 950 },
      { label: 'Public Transit', icon: 'transit', localPrice: 2.80 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 55 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 12 },
    ],
  },
  GBP: {
    currency: 'GBP',
    country: 'United Kingdom',
    flag: 'GB',
    pppFactor: 0.69,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 3.80 },
      { label: 'Meal Out', icon: 'meal', localPrice: 16.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 1200 },
      { label: 'Public Transit', icon: 'transit', localPrice: 2.50 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 60 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 13 },
    ],
  },
  JPY: {
    currency: 'JPY',
    country: 'Japan',
    flag: 'JP',
    pppFactor: 97.0,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 450 },
      { label: 'Meal Out', icon: 'meal', localPrice: 1000 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 85000 },
      { label: 'Public Transit', icon: 'transit', localPrice: 200 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 5000 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 1900 },
    ],
  },
  CAD: {
    currency: 'CAD',
    country: 'Canada',
    flag: 'CA',
    pppFactor: 1.24,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 5.00 },
      { label: 'Meal Out', icon: 'meal', localPrice: 20.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 1900 },
      { label: 'Public Transit', icon: 'transit', localPrice: 3.35 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 100 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 16 },
    ],
  },
  AUD: {
    currency: 'AUD',
    country: 'Australia',
    flag: 'AU',
    pppFactor: 1.48,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 5.50 },
      { label: 'Meal Out', icon: 'meal', localPrice: 22.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 2200 },
      { label: 'Public Transit', icon: 'transit', localPrice: 4.60 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 110 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 20 },
    ],
  },
  CHF: {
    currency: 'CHF',
    country: 'Switzerland',
    flag: 'CH',
    pppFactor: 1.21,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 6.50 },
      { label: 'Meal Out', icon: 'meal', localPrice: 30.00 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 2000 },
      { label: 'Public Transit', icon: 'transit', localPrice: 4.40 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 120 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 20 },
    ],
  },
  CNY: {
    currency: 'CNY',
    country: 'China',
    flag: 'CN',
    pppFactor: 3.99,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 28 },
      { label: 'Meal Out', icon: 'meal', localPrice: 40 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 4500 },
      { label: 'Public Transit', icon: 'transit', localPrice: 5 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 250 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 45 },
    ],
  },
  INR: {
    currency: 'INR',
    country: 'India',
    flag: 'IN',
    pppFactor: 22.9,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 180 },
      { label: 'Meal Out', icon: 'meal', localPrice: 300 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 15000 },
      { label: 'Public Transit', icon: 'transit', localPrice: 30 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 1500 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 250 },
    ],
  },
  MXN: {
    currency: 'MXN',
    country: 'Mexico',
    flag: 'MX',
    pppFactor: 9.50,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 60 },
      { label: 'Meal Out', icon: 'meal', localPrice: 180 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 10000 },
      { label: 'Public Transit', icon: 'transit', localPrice: 8 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 900 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 80 },
    ],
  },
  BRL: {
    currency: 'BRL',
    country: 'Brazil',
    flag: 'BR',
    pppFactor: 2.55,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 10 },
      { label: 'Meal Out', icon: 'meal', localPrice: 45 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 2500 },
      { label: 'Public Transit', icon: 'transit', localPrice: 5.30 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 250 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 30 },
    ],
  },
  KRW: {
    currency: 'KRW',
    country: 'South Korea',
    flag: 'KR',
    pppFactor: 880,
    costOfLiving: [
      { label: 'Coffee', icon: 'coffee', localPrice: 5500 },
      { label: 'Meal Out', icon: 'meal', localPrice: 10000 },
      { label: 'Monthly Rent (1BR)', icon: 'rent', localPrice: 700000 },
      { label: 'Public Transit', icon: 'transit', localPrice: 1400 },
      { label: 'Groceries (week)', icon: 'grocery', localPrice: 60000 },
      { label: 'Movie Ticket', icon: 'movie', localPrice: 14000 },
    ],
  },
}

const costIcons: Record<string, string> = {
  coffee: '\u2615',
  meal: '\uD83C\uDF7D\uFE0F',
  rent: '\uD83C\uDFE0',
  transit: '\uD83D\uDE8C',
  grocery: '\uD83D\uDED2',
  movie: '\uD83C\uDFAC',
}

export function getCostIcon(icon: string): string {
  return costIcons[icon] ?? '\uD83D\uDCB0'
}

/**
 * Calculate the PPP multiplier: how much further your money goes in the target country.
 * multiplier > 1 = your money buys more there
 * multiplier < 1 = your money buys less there
 */
export function getPPPMultiplier(
  fromCurrency: string,
  toCurrency: string,
  nominalRate: number,
): number {
  const fromPPP = pppData[fromCurrency]?.pppFactor
  const toPPP = pppData[toCurrency]?.pppFactor
  if (!fromPPP || !toPPP || nominalRate === 0) return 1

  // PPP implied rate = toPPP / fromPPP
  // Multiplier = PPP implied rate / nominal rate
  // If multiplier > 1, money goes further in target country
  const pppRate = toPPP / fromPPP
  return pppRate / nominalRate
}

/**
 * Calculate the PPP-adjusted equivalent value.
 * "Your X USD has the purchasing power of Y USD in [country]"
 */
export function getPPPAdjustedValue(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  nominalRate: number,
): number {
  const multiplier = getPPPMultiplier(fromCurrency, toCurrency, nominalRate)
  const nominalConverted = amount * nominalRate
  return nominalConverted * multiplier
}
