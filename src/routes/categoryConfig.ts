export interface CalculatorMeta {
  id: string
  name: string
  description: string
  path: string
}

export interface CategoryMeta {
  id: string
  name: string
  description: string
  basePath: string
  icon: string
  color: string
  calculators: CalculatorMeta[]
}

export const categories: CategoryMeta[] = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Interest, investments, ROI, and inflation tools',
    basePath: '/finance',
    icon: 'TrendingUp',
    color: 'emerald',
    calculators: [
      { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate how money grows with compounding', path: 'compound-interest' },
      { id: 'simple-interest', name: 'Simple Interest', description: 'Calculate simple interest on a principal', path: 'simple-interest' },
      { id: 'investment-growth', name: 'Investment Growth', description: 'Project investment growth with fees and inflation', path: 'investment-growth' },
      { id: 'roi', name: 'ROI Calculator', description: 'Calculate return on investment', path: 'roi' },
      { id: 'inflation', name: 'Inflation Calculator', description: 'See how inflation affects purchasing power', path: 'inflation' },
    ],
  },
  {
    id: 'mortgage',
    name: 'Mortgage & Home',
    description: 'Mortgage payments, affordability, and home buying',
    basePath: '/mortgage',
    icon: 'Home',
    color: 'blue',
    calculators: [
      { id: 'mortgage-payment', name: 'Mortgage Payment', description: 'Calculate monthly mortgage payments', path: 'mortgage-payment' },
      { id: 'home-affordability', name: 'Home Affordability', description: 'Find out how much home you can afford', path: 'home-affordability' },
      { id: 'down-payment', name: 'Down Payment', description: 'Plan your down payment savings', path: 'down-payment' },
      { id: 'refinance', name: 'Refinance Calculator', description: 'Compare refinancing options', path: 'refinance' },
      { id: 'rent-vs-buy', name: 'Rent vs Buy', description: 'Compare renting vs buying over time', path: 'rent-vs-buy' },
    ],
  },
  {
    id: 'car',
    name: 'Car Buying',
    description: 'Auto loans, leasing, and ownership costs',
    basePath: '/car',
    icon: 'Car',
    color: 'orange',
    calculators: [
      { id: 'car-loan', name: 'Car Loan', description: 'Calculate auto loan payments', path: 'car-loan' },
      { id: 'lease-vs-buy', name: 'Lease vs Buy', description: 'Compare leasing vs buying a car', path: 'lease-vs-buy' },
      { id: 'total-cost', name: 'Total Cost of Ownership', description: 'Calculate the true cost of owning a car', path: 'total-cost' },
      { id: 'monthly-payment', name: 'Monthly Payment', description: 'Estimate your monthly car payment', path: 'monthly-payment' },
    ],
  },
  {
    id: 'lending',
    name: 'Lending',
    description: 'Personal loans, credit cards, and debt tools',
    basePath: '/lending',
    icon: 'CreditCard',
    color: 'purple',
    calculators: [
      { id: 'personal-loan', name: 'Personal Loan', description: 'Calculate personal loan payments', path: 'personal-loan' },
      { id: 'credit-card-payoff', name: 'Credit Card Payoff', description: 'Plan your credit card payoff strategy', path: 'credit-card-payoff' },
      { id: 'debt-consolidation', name: 'Debt Consolidation', description: 'Compare consolidation options', path: 'debt-consolidation' },
      { id: 'apr', name: 'APR Calculator', description: 'Calculate the true APR including fees', path: 'apr' },
    ],
  },
  {
    id: 'loan',
    name: 'Loan Tools',
    description: 'General loans, amortization, and comparison',
    basePath: '/loan',
    icon: 'FileText',
    color: 'cyan',
    calculators: [
      { id: 'general-loan', name: 'General Loan', description: 'Calculate payments for any loan type', path: 'general-loan' },
      { id: 'amortization', name: 'Amortization Schedule', description: 'View detailed payment schedules', path: 'amortization' },
      { id: 'debt-to-income', name: 'Debt-to-Income Ratio', description: 'Calculate your DTI ratio', path: 'debt-to-income' },
      { id: 'loan-comparison', name: 'Loan Comparison', description: 'Compare multiple loan options', path: 'loan-comparison' },
    ],
  },
  {
    id: 'salary',
    name: 'Salary',
    description: 'Pay conversion, take-home pay, and raises',
    basePath: '/salary',
    icon: 'DollarSign',
    color: 'green',
    calculators: [
      { id: 'salary-to-hourly', name: 'Salary to Hourly', description: 'Convert between salary and hourly rates', path: 'salary-to-hourly' },
      { id: 'take-home-pay', name: 'Take-Home Pay', description: 'Estimate your net pay after taxes', path: 'take-home-pay' },
      { id: 'overtime', name: 'Overtime Calculator', description: 'Calculate overtime pay', path: 'overtime' },
      { id: 'raise-bonus', name: 'Raise & Bonus', description: 'Calculate salary raises and bonuses', path: 'raise-bonus' },
    ],
  },
  {
    id: 'common',
    name: 'Common Tools',
    description: 'Everyday calculators and converters',
    basePath: '/common',
    icon: 'Calculator',
    color: 'rose',
    calculators: [
      { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and split bills', path: 'tip' },
      { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages easily', path: 'percentage' },
      { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between different units', path: 'unit-converter' },
      { id: 'bmi', name: 'BMI Calculator', description: 'Calculate your Body Mass Index', path: 'bmi' },
      { id: 'age', name: 'Age Calculator', description: 'Calculate exact age from birthdate', path: 'age' },
      { id: 'currency-converter', name: 'Currency Converter', description: 'Convert currencies with live rates', path: 'currency-converter' },
    ],
  },
  {
    id: 'aitech',
    name: 'AI & Tech',
    description: 'Trending AI models, tech news, and industry insights',
    basePath: '/aitech',
    icon: 'Sparkles',
    color: 'indigo',
    calculators: [
      { id: 'ai-model-explorer', name: 'AI Model Explorer', description: 'Explore trending AI models from Hugging Face', path: 'ai-model-explorer' },
      { id: 'tech-news', name: 'Tech News Feed', description: 'Latest technology and AI news from Hacker News', path: 'tech-news' },
    ],
  },
  {
    id: 'ittools',
    name: 'IT Tools',
    description: 'Networking, base conversion, bandwidth, CLI reference, and password tools',
    basePath: '/ittools',
    icon: 'Terminal',
    color: 'amber',
    calculators: [
      { id: 'subnet', name: 'Subnet Calculator', description: 'Calculate network addresses, hosts, and subnet masks', path: 'subnet' },
      { id: 'base-converter', name: 'Number Base Converter', description: 'Convert between binary, octal, decimal, and hex', path: 'base-converter' },
      { id: 'bandwidth', name: 'Bandwidth & Transfer', description: 'Calculate file transfer times and speed conversions', path: 'bandwidth' },
      { id: 'cli-reference', name: 'CLI Quick Reference', description: 'PowerShell, CMD, and Linux command lookup', path: 'cli-reference' },
      { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords with strength analysis', path: 'password-generator' },
    ],
  },
]

export function getCategoryById(id: string) {
  return categories.find(c => c.id === id)
}

export function getCalculatorByPath(categoryId: string, calcPath: string) {
  const category = getCategoryById(categoryId)
  return category?.calculators.find(c => c.path === calcPath)
}
