import { calculateStateTax } from '@/utils/stateTaxData'

export interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
  totalInterest: number
}

export function compoundInterest(
  principal: number,
  rate: number,
  compoundsPerYear: number,
  years: number,
  monthlyContribution: number
): { finalBalance: number; totalContributions: number; totalInterest: number; yearlyData: { year: number; balance: number; contributions: number; interest: number }[] } {
  const r = rate / 100
  const n = compoundsPerYear
  const yearlyData: { year: number; balance: number; contributions: number; interest: number }[] = []
  let balance = principal
  let totalContributions = principal

  for (let year = 1; year <= years; year++) {
    for (let period = 0; period < n; period++) {
      balance *= (1 + r / n)
      balance += (monthlyContribution * 12) / n
    }
    totalContributions += monthlyContribution * 12
    yearlyData.push({
      year,
      balance,
      contributions: totalContributions,
      interest: balance - totalContributions,
    })
  }

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    yearlyData,
  }
}

export function simpleInterest(principal: number, rate: number, years: number) {
  const r = rate / 100
  const interest = principal * r * years
  const yearlyData = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    balance: principal + principal * r * (i + 1),
    interest: principal * r * (i + 1),
  }))
  return { total: principal + interest, interest, yearlyData }
}

export function monthlyMortgagePayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function amortizationSchedule(principal: number, annualRate: number, years: number): AmortizationRow[] {
  const r = annualRate / 100 / 12
  const n = years * 12
  const payment = monthlyMortgagePayment(principal, annualRate, years)
  const schedule: AmortizationRow[] = []
  let balance = principal
  let totalInterest = 0

  for (let i = 1; i <= n; i++) {
    const interest = balance * r
    const principalPart = payment - interest
    balance -= principalPart
    totalInterest += interest
    schedule.push({
      period: i,
      payment,
      principal: principalPart,
      interest,
      balance: Math.max(0, balance),
      totalInterest,
    })
  }
  return schedule
}

export function investmentGrowth(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  annualFee: number,
  inflationRate: number
) {
  const yearlyData: { year: number; nominal: number; real: number; contributions: number }[] = []
  let nominal = principal
  let totalContributions = principal
  const netReturn = (annualReturn - annualFee) / 100

  for (let year = 1; year <= years; year++) {
    nominal = (nominal + monthlyContribution * 12) * (1 + netReturn)
    totalContributions += monthlyContribution * 12
    const real = nominal / Math.pow(1 + inflationRate / 100, year)
    yearlyData.push({ year, nominal, real, contributions: totalContributions })
  }

  return { finalNominal: nominal, finalReal: yearlyData[yearlyData.length - 1]?.real ?? 0, totalContributions, yearlyData }
}

export function roi(initialInvestment: number, finalValue: number) {
  const gain = finalValue - initialInvestment
  const roiPercent = (gain / initialInvestment) * 100
  return { gain, roiPercent }
}

export function inflationAdjusted(amount: number, rate: number, years: number) {
  const yearlyData = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    value: amount / Math.pow(1 + rate / 100, i + 1),
  }))
  return { futureValue: yearlyData[yearlyData.length - 1]?.value ?? amount, yearlyData }
}

export function carLoan(price: number, downPayment: number, rate: number, termMonths: number) {
  const principal = price - downPayment
  const r = rate / 100 / 12
  if (r === 0) return { monthlyPayment: principal / termMonths, totalInterest: 0, totalCost: price }
  const payment = principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
  const totalPaid = payment * termMonths
  return { monthlyPayment: payment, totalInterest: totalPaid - principal, totalCost: totalPaid + downPayment }
}

export function creditCardPayoff(balance: number, apr: number, monthlyPayment: number) {
  const r = apr / 100 / 12
  let remaining = balance
  let totalInterest = 0
  const monthlyData: { month: number; balance: number; interest: number; principal: number }[] = []
  let month = 0

  while (remaining > 0.01 && month < 600) {
    month++
    const interest = remaining * r
    const principal = Math.min(monthlyPayment - interest, remaining)
    if (monthlyPayment <= interest) {
      return { months: Infinity, totalInterest: Infinity, monthlyData: [] }
    }
    remaining -= principal
    totalInterest += interest
    monthlyData.push({ month, balance: Math.max(0, remaining), interest, principal })
  }

  return { months: month, totalInterest, monthlyData }
}

export function debtToIncomeRatio(monthlyDebts: number, monthlyIncome: number) {
  if (monthlyIncome === 0) return 0
  return (monthlyDebts / monthlyIncome) * 100
}

export function salaryToHourly(annualSalary: number, hoursPerWeek: number) {
  const hourly = annualSalary / (52 * hoursPerWeek)
  return {
    hourly,
    daily: hourly * (hoursPerWeek / 5),
    weekly: annualSalary / 52,
    biweekly: annualSalary / 26,
    monthly: annualSalary / 12,
    annual: annualSalary,
  }
}

export function calculateTakeHomePay(grossAnnual: number, filingStatus: 'single' | 'married', stateCode?: string) {
  // 2024 Federal tax brackets (simplified)
  const brackets = filingStatus === 'single'
    ? [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ]
    : [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ]

  const standardDeduction = filingStatus === 'single' ? 14600 : 29200
  const taxableIncome = Math.max(0, grossAnnual - standardDeduction)

  let federalTax = 0
  let prev = 0
  for (const bracket of brackets) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, bracket.limit) - prev
    federalTax += taxable * bracket.rate
    prev = bracket.limit
  }

  const socialSecurity = Math.min(grossAnnual, 168600) * 0.062
  const medicare = grossAnnual * 0.0145
  const additionalMedicare = grossAnnual > 200000 ? (grossAnnual - 200000) * 0.009 : 0
  const fica = socialSecurity + medicare + additionalMedicare

  let stateTax = 0
  if (stateCode) {
    stateTax = calculateStateTax(grossAnnual, stateCode, filingStatus)
  }

  const totalTax = federalTax + fica + stateTax
  const netAnnual = grossAnnual - totalTax

  return {
    grossAnnual,
    federalTax,
    stateTax,
    socialSecurity,
    medicare: medicare + additionalMedicare,
    fica,
    totalTax,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiweekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    effectiveRate: grossAnnual > 0 ? (totalTax / grossAnnual) * 100 : 0,
  }
}

export function calculateBMI(weightKg: number, heightM: number) {
  const bmi = weightKg / (heightM * heightM)
  let category: string
  let color: string
  if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6' }
  else if (bmi < 25) { category = 'Normal'; color = '#22c55e' }
  else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b' }
  else { category = 'Obese'; color = '#ef4444' }
  return { bmi, category, color }
}

export function calculateTip(billAmount: number, tipPercent: number, numPeople: number) {
  const tipAmount = billAmount * (tipPercent / 100)
  const total = billAmount + tipAmount
  return {
    tipAmount,
    total,
    perPerson: numPeople > 0 ? total / numPeople : total,
    tipPerPerson: numPeople > 0 ? tipAmount / numPeople : tipAmount,
  }
}

export function calculateAge(birthDate: Date) {
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  let days = today.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  if (nextBirthday <= today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months

  return { years, months, days, daysUntilBirthday, totalDays, totalWeeks, totalMonths }
}

export function leaseVsBuy(
  price: number,
  downPayment: number,
  loanRate: number,
  loanTermMonths: number,
  leaseMonthly: number,
  leaseTermMonths: number,
  leaseDownPayment: number,
  residualValue: number,
  depreciationRate: number
) {
  const loan = carLoan(price, downPayment, loanRate, loanTermMonths)
  const totalLeaseCost = leaseDownPayment + leaseMonthly * leaseTermMonths
  const carValueAfterLease = price * Math.pow(1 - depreciationRate / 100, leaseTermMonths / 12)
  const totalBuyCost = loan.totalCost
  const equityAfterLoan = carValueAfterLease > 0 ? price * Math.pow(1 - depreciationRate / 100, loanTermMonths / 12) : 0

  return {
    totalLeaseCost,
    totalBuyCost,
    monthlyBuy: loan.monthlyPayment,
    monthlyLease: leaseMonthly,
    equityAfterLoan,
    carValueAfterLease,
    residualValue,
    savingsIfBuy: totalLeaseCost - (totalBuyCost - equityAfterLoan),
  }
}

export function debtConsolidation(
  debts: { name: string; balance: number; rate: number; minPayment: number }[],
  consolidatedRate: number,
  consolidatedTermMonths: number
) {
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0)
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0)

  let totalInterestSeparate = 0
  for (const debt of debts) {
    const payoff = creditCardPayoff(debt.balance, debt.rate, debt.minPayment)
    totalInterestSeparate += payoff.totalInterest === Infinity ? debt.balance * 2 : payoff.totalInterest
  }

  const consolidated = carLoan(totalBalance, 0, consolidatedRate, consolidatedTermMonths)
  const totalInterestConsolidated = consolidated.totalInterest

  return {
    totalBalance,
    totalMinPayments,
    consolidatedPayment: consolidated.monthlyPayment,
    totalInterestSeparate,
    totalInterestConsolidated,
    interestSaved: totalInterestSeparate - totalInterestConsolidated,
    monthlyPaymentSaved: totalMinPayments - consolidated.monthlyPayment,
  }
}

export function refinanceCalculator(
  currentBalance: number,
  currentRate: number,
  currentRemainingMonths: number,
  newRate: number,
  newTermMonths: number,
  closingCosts: number
) {
  const currentPayment = monthlyMortgagePayment(currentBalance, currentRate, currentRemainingMonths / 12)
  const newPayment = monthlyMortgagePayment(currentBalance + closingCosts, newRate, newTermMonths / 12)
  const monthlySavings = currentPayment - newPayment
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity

  const currentTotalCost = currentPayment * currentRemainingMonths
  const newTotalCost = newPayment * newTermMonths
  const totalSavings = currentTotalCost - newTotalCost

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    currentTotalCost,
    newTotalCost,
    totalSavings,
    closingCosts,
  }
}

export function homeAffordability(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  interestRate: number,
  loanTermYears: number,
  propertyTaxRate: number,
  insuranceAnnual: number,
  maxDTI: number
) {
  const monthlyIncome = annualIncome / 12
  const maxMonthlyPayment = monthlyIncome * (maxDTI / 100) - monthlyDebts

  const r = interestRate / 100 / 12
  const n = loanTermYears * 12

  const monthlyTax = (propertyTaxRate / 100) * 1 / 12
  const monthlyInsurance = insuranceAnnual / 12

  const availableForPI = maxMonthlyPayment - monthlyInsurance

  let maxLoan: number
  if (r === 0) {
    maxLoan = availableForPI * n / (1 + monthlyTax * n)
  } else {
    maxLoan = (availableForPI / (r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) + monthlyTax))
  }

  const maxHomePrice = maxLoan + downPayment

  return {
    maxHomePrice: Math.max(0, maxHomePrice),
    maxLoanAmount: Math.max(0, maxLoan),
    estimatedMonthlyPayment: maxMonthlyPayment,
    downPayment,
  }
}

export function rentVsBuy(
  monthlyRent: number,
  annualRentIncrease: number,
  homePrice: number,
  downPayment: number,
  mortgageRate: number,
  loanTermYears: number,
  propertyTaxRate: number,
  maintenanceRate: number,
  homeAppreciation: number,
  years: number
) {
  const loanAmount = homePrice - downPayment
  const monthlyMortgage = monthlyMortgagePayment(loanAmount, mortgageRate, loanTermYears)
  const yearlyData: { year: number; rentCost: number; buyCost: number; cumulativeRent: number; cumulativeBuy: number; homeValue: number; equity: number }[] = []

  let cumulativeRent = 0
  let cumulativeBuy = downPayment
  let currentRent = monthlyRent
  let homeValue = homePrice

  for (let year = 1; year <= years; year++) {
    const yearRent = currentRent * 12
    cumulativeRent += yearRent

    const yearMortgage = monthlyMortgage * 12
    const yearTax = homeValue * (propertyTaxRate / 100)
    const yearMaintenance = homeValue * (maintenanceRate / 100)
    const yearBuyCost = yearMortgage + yearTax + yearMaintenance
    cumulativeBuy += yearBuyCost

    homeValue *= (1 + homeAppreciation / 100)
    currentRent *= (1 + annualRentIncrease / 100)

    const schedule = amortizationSchedule(loanAmount, mortgageRate, loanTermYears)
    const monthIndex = Math.min(year * 12, schedule.length) - 1
    const remainingBalance = monthIndex >= 0 ? schedule[monthIndex].balance : loanAmount
    const equity = homeValue - remainingBalance

    yearlyData.push({
      year,
      rentCost: yearRent,
      buyCost: yearBuyCost,
      cumulativeRent,
      cumulativeBuy,
      homeValue,
      equity,
    })
  }

  return { yearlyData, monthlyMortgage }
}

export function loanComparison(
  loans: { name: string; amount: number; rate: number; termMonths: number }[]
) {
  return loans.map(loan => {
    const r = loan.rate / 100 / 12
    const n = loan.termMonths
    let monthlyPayment: number
    if (r === 0) {
      monthlyPayment = loan.amount / n
    } else {
      monthlyPayment = loan.amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    }
    const totalPaid = monthlyPayment * n
    const totalInterest = totalPaid - loan.amount
    return {
      ...loan,
      monthlyPayment,
      totalPaid,
      totalInterest,
    }
  })
}

export function overtimeCalculator(hourlyRate: number, regularHours: number, overtimeHours: number, overtimeMultiplier: number) {
  const regularPay = hourlyRate * regularHours
  const overtimePay = hourlyRate * overtimeMultiplier * overtimeHours
  const totalWeekly = regularPay + overtimePay
  return {
    regularPay,
    overtimePay,
    totalWeekly,
    totalBiweekly: totalWeekly * 2,
    totalMonthly: totalWeekly * 52 / 12,
    totalAnnual: totalWeekly * 52,
    effectiveHourlyRate: totalWeekly / (regularHours + overtimeHours),
  }
}

export function raiseCalculator(currentSalary: number, raisePercent: number, bonusPercent: number) {
  const raiseAmount = currentSalary * (raisePercent / 100)
  const newSalary = currentSalary + raiseAmount
  const bonusAmount = newSalary * (bonusPercent / 100)
  return {
    currentSalary,
    newSalary,
    raiseAmount,
    bonusAmount,
    totalCompensation: newSalary + bonusAmount,
    monthlyIncrease: raiseAmount / 12,
  }
}

export function percentageCalculator(mode: 'whatIs' | 'whatPercent' | 'ofWhat', x: number, y: number) {
  switch (mode) {
    case 'whatIs': return (x / 100) * y
    case 'whatPercent': return y !== 0 ? (x / y) * 100 : 0
    case 'ofWhat': return x !== 0 ? (y / (x / 100)) : 0
  }
}

export const unitConversions: Record<string, Record<string, number>> = {
  length: { meter: 1, kilometer: 0.001, centimeter: 100, millimeter: 1000, mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701 },
  weight: { kilogram: 1, gram: 1000, milligram: 1000000, pound: 2.20462, ounce: 35.274, ton: 0.001 },
  temperature: { celsius: 1, fahrenheit: 1, kelvin: 1 },
  volume: { liter: 1, milliliter: 1000, gallon: 0.264172, quart: 1.05669, pint: 2.11338, cup: 4.22675, 'fluid ounce': 33.814 },
  area: { 'square meter': 1, 'square kilometer': 0.000001, 'square foot': 10.7639, 'square yard': 1.19599, acre: 0.000247105, hectare: 0.0001 },
  speed: { 'meters/second': 1, 'kilometers/hour': 3.6, 'miles/hour': 2.23694, knot: 1.94384 },
}

export function convertUnit(value: number, category: string, from: string, to: string): number {
  if (category === 'temperature') {
    if (from === 'celsius' && to === 'fahrenheit') return value * 9 / 5 + 32
    if (from === 'celsius' && to === 'kelvin') return value + 273.15
    if (from === 'fahrenheit' && to === 'celsius') return (value - 32) * 5 / 9
    if (from === 'fahrenheit' && to === 'kelvin') return (value - 32) * 5 / 9 + 273.15
    if (from === 'kelvin' && to === 'celsius') return value - 273.15
    if (from === 'kelvin' && to === 'fahrenheit') return (value - 273.15) * 9 / 5 + 32
    return value
  }
  const conversions = unitConversions[category]
  if (!conversions) return value
  const baseValue = value / conversions[from]
  return baseValue * conversions[to]
}

export function totalCostOfOwnership(
  purchasePrice: number,
  downPayment: number,
  loanRate: number,
  loanTermMonths: number,
  yearsOwned: number,
  annualInsurance: number,
  annualMaintenance: number,
  monthlyFuel: number,
  depreciationRate: number
) {
  const loan = carLoan(purchasePrice, downPayment, loanRate, loanTermMonths)
  const totalInsurance = annualInsurance * yearsOwned
  const totalMaintenance = annualMaintenance * yearsOwned
  const totalFuel = monthlyFuel * 12 * yearsOwned
  const valueAfter = purchasePrice * Math.pow(1 - depreciationRate / 100, yearsOwned)
  const depreciation = purchasePrice - valueAfter
  const totalCost = loan.totalCost + totalInsurance + totalMaintenance + totalFuel

  return {
    totalCost,
    depreciation,
    totalInsurance,
    totalMaintenance,
    totalFuel,
    totalFinancing: loan.totalInterest,
    resaleValue: valueAfter,
    costPerMonth: totalCost / (yearsOwned * 12),
    costPerYear: totalCost / yearsOwned,
    breakdown: [
      { label: 'Purchase Price', value: purchasePrice },
      { label: 'Financing Cost', value: loan.totalInterest },
      { label: 'Insurance', value: totalInsurance },
      { label: 'Maintenance', value: totalMaintenance },
      { label: 'Fuel', value: totalFuel },
      { label: 'Depreciation', value: depreciation },
    ],
  }
}

export function aprCalculator(loanAmount: number, totalFees: number, interestRate: number, termMonths: number) {
  const effectiveAmount = loanAmount - totalFees
  const r = interestRate / 100 / 12
  const payment = loanAmount * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)

  // Newton's method to find APR
  let aprGuess = interestRate / 100 / 12
  for (let i = 0; i < 100; i++) {
    const f = effectiveAmount * (aprGuess * Math.pow(1 + aprGuess, termMonths)) / (Math.pow(1 + aprGuess, termMonths) - 1) - payment
    const fPrime = effectiveAmount * (
      (Math.pow(1 + aprGuess, termMonths) + aprGuess * termMonths * Math.pow(1 + aprGuess, termMonths - 1)) * (Math.pow(1 + aprGuess, termMonths) - 1) -
      aprGuess * Math.pow(1 + aprGuess, termMonths) * termMonths * Math.pow(1 + aprGuess, termMonths - 1)
    ) / Math.pow(Math.pow(1 + aprGuess, termMonths) - 1, 2)

    if (Math.abs(fPrime) < 1e-12) break
    aprGuess -= f / fPrime
    if (Math.abs(f) < 1e-10) break
  }

  const apr = aprGuess * 12 * 100
  return {
    apr,
    nominalRate: interestRate,
    monthlyPayment: payment,
    totalFees,
    totalCost: payment * termMonths,
    totalInterest: payment * termMonths - loanAmount,
  }
}

export function downPaymentSavings(
  homePrice: number,
  targetPercent: number,
  currentSavings: number,
  monthlySaving: number,
  savingsRate: number
) {
  const target = homePrice * (targetPercent / 100)
  const remaining = target - currentSavings
  if (remaining <= 0) return { monthsNeeded: 0, target, yearlyData: [] }

  const r = savingsRate / 100 / 12
  let balance = currentSavings
  const yearlyData: { year: number; savings: number }[] = []
  let months = 0

  while (balance < target && months < 600) {
    months++
    balance = balance * (1 + r) + monthlySaving
    if (months % 12 === 0) {
      yearlyData.push({ year: months / 12, savings: balance })
    }
  }

  if (months % 12 !== 0) {
    yearlyData.push({ year: Math.ceil(months / 12), savings: balance })
  }

  return { monthsNeeded: months, target, yearlyData }
}

// Reverse calculation functions - solve for inputs given a target result

export function solveLoanAmount(monthlyPayment: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12
  const n = years * 12
  if (r === 0) return monthlyPayment * n
  return monthlyPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
}

export function solveLoanAmountFromMonths(monthlyPayment: number, annualRate: number, totalMonths: number): number {
  const r = annualRate / 100 / 12
  if (r === 0) return monthlyPayment * totalMonths
  return monthlyPayment * (Math.pow(1 + r, totalMonths) - 1) / (r * Math.pow(1 + r, totalMonths))
}

export function solveVehiclePrice(monthlyPayment: number, downPayment: number, annualRate: number, termMonths: number): number {
  const loanAmount = solveLoanAmountFromMonths(monthlyPayment, annualRate, termMonths)
  return loanAmount + downPayment
}

export function solveHomePriceFromPayment(
  totalMonthlyPayment: number,
  downPaymentPercent: number,
  annualRate: number,
  years: number,
  propertyTaxRate: number,
  annualInsurance: number,
): number {
  const monthlyInsurance = annualInsurance / 12
  const availableForPIAndTax = totalMonthlyPayment - monthlyInsurance
  if (availableForPIAndTax <= 0) return 0

  const r = annualRate / 100 / 12
  const n = years * 12
  const piCoeff = r === 0 ? (1 / n) : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const loanFraction = 1 - downPaymentPercent / 100
  const monthlyPropertyTaxCoeff = propertyTaxRate / 100 / 12

  const homePrice = availableForPIAndTax / (loanFraction * piCoeff + monthlyPropertyTaxCoeff)
  return Math.max(0, homePrice)
}
