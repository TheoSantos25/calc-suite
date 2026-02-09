import { HashRouter, Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import AppLayout from '@/components/layout/AppLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Finance
const CompoundInterestPage = lazy(() => import('@/pages/finance/CompoundInterestPage'))
const SimpleInterestPage = lazy(() => import('@/pages/finance/SimpleInterestPage'))
const InvestmentGrowthPage = lazy(() => import('@/pages/finance/InvestmentGrowthPage'))
const ROIPage = lazy(() => import('@/pages/finance/ROIPage'))
const InflationPage = lazy(() => import('@/pages/finance/InflationPage'))

// Mortgage
const MortgagePaymentPage = lazy(() => import('@/pages/mortgage/MortgagePaymentPage'))
const HomeAffordabilityPage = lazy(() => import('@/pages/mortgage/HomeAffordabilityPage'))
const DownPaymentPage = lazy(() => import('@/pages/mortgage/DownPaymentPage'))
const RefinancePage = lazy(() => import('@/pages/mortgage/RefinancePage'))
const RentVsBuyPage = lazy(() => import('@/pages/mortgage/RentVsBuyPage'))

// Car
const CarLoanPage = lazy(() => import('@/pages/car/CarLoanPage'))
const LeaseVsBuyPage = lazy(() => import('@/pages/car/LeaseVsBuyPage'))
const TotalCostPage = lazy(() => import('@/pages/car/TotalCostPage'))
const MonthlyPaymentPage = lazy(() => import('@/pages/car/MonthlyPaymentPage'))

// Lending
const PersonalLoanPage = lazy(() => import('@/pages/lending/PersonalLoanPage'))
const CreditCardPayoffPage = lazy(() => import('@/pages/lending/CreditCardPayoffPage'))
const DebtConsolidationPage = lazy(() => import('@/pages/lending/DebtConsolidationPage'))
const APRPage = lazy(() => import('@/pages/lending/APRPage'))

// Loan
const GeneralLoanPage = lazy(() => import('@/pages/loan/GeneralLoanPage'))
const AmortizationPage = lazy(() => import('@/pages/loan/AmortizationPage'))
const DebtToIncomePage = lazy(() => import('@/pages/loan/DebtToIncomePage'))
const LoanComparisonPage = lazy(() => import('@/pages/loan/LoanComparisonPage'))

// Salary
const SalaryToHourlyPage = lazy(() => import('@/pages/salary/SalaryToHourlyPage'))
const TakeHomePayPage = lazy(() => import('@/pages/salary/TakeHomePayPage'))
const OvertimePage = lazy(() => import('@/pages/salary/OvertimePage'))
const RaiseBonusPage = lazy(() => import('@/pages/salary/RaiseBonusPage'))

// Common
const TipPage = lazy(() => import('@/pages/common/TipPage'))
const PercentagePage = lazy(() => import('@/pages/common/PercentagePage'))
const UnitConverterPage = lazy(() => import('@/pages/common/UnitConverterPage'))
const BMIPage = lazy(() => import('@/pages/common/BMIPage'))
const AgePage = lazy(() => import('@/pages/common/AgePage'))
const CurrencyConverterPage = lazy(() => import('@/pages/common/CurrencyConverterPage'))

// AI & Tech
const AIModelExplorerPage = lazy(() => import('@/pages/aitech/AIModelExplorerPage'))
const TechNewsFeedPage = lazy(() => import('@/pages/aitech/TechNewsFeedPage'))

// IT Tools
const SubnetPage = lazy(() => import('@/pages/ittools/SubnetPage'))
const BaseConverterPage = lazy(() => import('@/pages/ittools/BaseConverterPage'))
const BandwidthPage = lazy(() => import('@/pages/ittools/BandwidthPage'))
const CLIReferencePage = lazy(() => import('@/pages/ittools/CLIReferencePage'))
const PasswordGeneratorPage = lazy(() => import('@/pages/ittools/PasswordGeneratorPage'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/:categoryId" element={<CategoryPage />} />

            {/* Finance */}
            <Route path="/finance/compound-interest" element={<CompoundInterestPage />} />
            <Route path="/finance/simple-interest" element={<SimpleInterestPage />} />
            <Route path="/finance/investment-growth" element={<InvestmentGrowthPage />} />
            <Route path="/finance/roi" element={<ROIPage />} />
            <Route path="/finance/inflation" element={<InflationPage />} />

            {/* Mortgage */}
            <Route path="/mortgage/mortgage-payment" element={<MortgagePaymentPage />} />
            <Route path="/mortgage/home-affordability" element={<HomeAffordabilityPage />} />
            <Route path="/mortgage/down-payment" element={<DownPaymentPage />} />
            <Route path="/mortgage/refinance" element={<RefinancePage />} />
            <Route path="/mortgage/rent-vs-buy" element={<RentVsBuyPage />} />

            {/* Car */}
            <Route path="/car/car-loan" element={<CarLoanPage />} />
            <Route path="/car/lease-vs-buy" element={<LeaseVsBuyPage />} />
            <Route path="/car/total-cost" element={<TotalCostPage />} />
            <Route path="/car/monthly-payment" element={<MonthlyPaymentPage />} />

            {/* Lending */}
            <Route path="/lending/personal-loan" element={<PersonalLoanPage />} />
            <Route path="/lending/credit-card-payoff" element={<CreditCardPayoffPage />} />
            <Route path="/lending/debt-consolidation" element={<DebtConsolidationPage />} />
            <Route path="/lending/apr" element={<APRPage />} />

            {/* Loan */}
            <Route path="/loan/general-loan" element={<GeneralLoanPage />} />
            <Route path="/loan/amortization" element={<AmortizationPage />} />
            <Route path="/loan/debt-to-income" element={<DebtToIncomePage />} />
            <Route path="/loan/loan-comparison" element={<LoanComparisonPage />} />

            {/* Salary */}
            <Route path="/salary/salary-to-hourly" element={<SalaryToHourlyPage />} />
            <Route path="/salary/take-home-pay" element={<TakeHomePayPage />} />
            <Route path="/salary/overtime" element={<OvertimePage />} />
            <Route path="/salary/raise-bonus" element={<RaiseBonusPage />} />

            {/* Common */}
            <Route path="/common/tip" element={<TipPage />} />
            <Route path="/common/percentage" element={<PercentagePage />} />
            <Route path="/common/unit-converter" element={<UnitConverterPage />} />
            <Route path="/common/bmi" element={<BMIPage />} />
            <Route path="/common/age" element={<AgePage />} />
            <Route path="/common/currency-converter" element={<CurrencyConverterPage />} />

            {/* AI & Tech */}
            <Route path="/aitech/ai-model-explorer" element={<AIModelExplorerPage />} />
            <Route path="/aitech/tech-news" element={<TechNewsFeedPage />} />

            {/* IT Tools */}
            <Route path="/ittools/subnet" element={<SubnetPage />} />
            <Route path="/ittools/base-converter" element={<BaseConverterPage />} />
            <Route path="/ittools/bandwidth" element={<BandwidthPage />} />
            <Route path="/ittools/cli-reference" element={<CLIReferencePage />} />
            <Route path="/ittools/password-generator" element={<PasswordGeneratorPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
