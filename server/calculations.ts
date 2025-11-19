import type { RevenueProduct, CogsItem, Salary, OpexItem, FixedExpense, CapexItem, FundingSource } from "../drizzle/schema";

// Helper to calculate months between two dates
function getMonthsBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}

// Helper to check if a date is within a range
function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

// Calculate total revenue for a given month
export function calculateMonthlyRevenue(
  products: RevenueProduct[],
  month: Date
): number {
  let totalRevenue = 0;
  
  for (const product of products) {
    // Calculate base revenue: price * volume
    const baseRevenue = product.averagePrice * product.volume;
    
    // Apply seasonality factor (stored as percentage, e.g., 100 = 100%)
    const seasonalRevenue = (baseRevenue * product.seasonalityFactor) / 100;
    
    totalRevenue += seasonalRevenue;
  }
  
  return totalRevenue;
}

// Calculate total COGS for a given month
export function calculateMonthlyCOGS(
  cogsItems: CogsItem[],
  revenue: number,
  products: RevenueProduct[],
  month: Date,
  projectStartDate: Date
): number {
  let totalCOGS = 0;
  const monthsSinceStart = getMonthsBetween(projectStartDate, month);
  
  for (const item of cogsItems) {
    let itemCost = 0;
    
    // Calculate growth multiplier based on growth rate (stored in basis points)
    const yearsElapsed = monthsSinceStart / 12;
    const growthMultiplier = Math.pow(1 + (item.growthRate / 10000), yearsElapsed);
    
    if (item.costType === "fixed") {
      itemCost = item.amount * growthMultiplier;
    } else if (item.costType === "variable") {
      // Variable cost per unit
      const totalVolume = products.reduce((sum, p) => sum + p.volume, 0);
      itemCost = item.amount * totalVolume * growthMultiplier;
    } else if (item.costType === "percentage") {
      // Percentage of revenue (amount stored as percentage * 100)
      itemCost = (revenue * item.amount) / 10000;
    }
    
    totalCOGS += itemCost;
  }
  
  return totalCOGS;
}

// Calculate total salaries for a given month
export function calculateMonthlySalaries(
  salaries: Salary[],
  month: Date
): number {
  let totalSalaries = 0;
  
  for (const salary of salaries) {
    const startDate = new Date(salary.startDate);
    const endDate = salary.endDate ? new Date(salary.endDate) : new Date(2099, 11, 31);
    
    if (isDateInRange(month, startDate, endDate)) {
      totalSalaries += salary.monthlyCost;
    }
  }
  
  return totalSalaries;
}

// Calculate total OPEX for a given month
export function calculateMonthlyOPEX(
  opexItems: OpexItem[],
  revenue: number
): number {
  let totalOPEX = 0;
  
  for (const item of opexItems) {
    if (item.expenseType === "fixed") {
      totalOPEX += item.amount;
    } else if (item.expenseType === "percentage") {
      // Percentage of revenue (amount stored as percentage * 100)
      totalOPEX += (revenue * item.amount) / 10000;
    }
  }
  
  return totalOPEX;
}

// Calculate fixed expenses for a given month
export function calculateMonthlyFixedExpenses(
  fixedExpenses: FixedExpense[],
  month: Date
): number {
  let totalExpenses = 0;
  
  for (const expense of fixedExpenses) {
    const expenseDate = new Date(expense.date);
    
    if (expense.frequency === "once") {
      // One-time expense
      if (expenseDate.getFullYear() === month.getFullYear() && 
          expenseDate.getMonth() === month.getMonth()) {
        totalExpenses += expense.amount;
      }
    } else if (expense.frequency === "monthly") {
      // Monthly recurring
      if (expenseDate <= month) {
        totalExpenses += expense.amount;
      }
    } else if (expense.frequency === "quarterly") {
      // Quarterly recurring
      const monthsSinceStart = getMonthsBetween(expenseDate, month);
      if (monthsSinceStart >= 0 && monthsSinceStart % 3 === 0) {
        totalExpenses += expense.amount;
      }
    } else if (expense.frequency === "annually") {
      // Annual recurring
      if (expenseDate.getMonth() === month.getMonth() && expenseDate <= month) {
        totalExpenses += expense.amount;
      }
    }
  }
  
  return totalExpenses;
}

// Calculate CAPEX for a given month
export function calculateMonthlyCAPEX(
  capexItems: CapexItem[],
  month: Date
): number {
  let totalCAPEX = 0;
  
  for (const item of capexItems) {
    const purchaseDate = new Date(item.purchaseDate);
    const paymentDate = new Date(purchaseDate);
    paymentDate.setDate(paymentDate.getDate() + item.paymentDelay);
    
    if (paymentDate.getFullYear() === month.getFullYear() && 
        paymentDate.getMonth() === month.getMonth()) {
      totalCAPEX += item.amount;
    }
  }
  
  return totalCAPEX;
}

// Calculate debt service for a given month
export function calculateMonthlyDebtService(
  fundingSources: FundingSource[],
  month: Date,
  projectStartDate: Date
): { interest: number; principal: number } {
  let totalInterest = 0;
  let totalPrincipal = 0;
  
  const debtSources = fundingSources.filter(f => f.sourceType === "debt");
  
  for (const debt of debtSources) {
    const debtDate = new Date(debt.date);
    
    if (debtDate <= month) {
      // Calculate monthly interest (interestRate stored in basis points)
      const monthlyRate = (debt.interestRate / 10000) / 12;
      const monthlyInterest = debt.amount * monthlyRate;
      totalInterest += monthlyInterest;
      
      // For simplicity, assume interest-only payments for now
      // In a real scenario, you'd implement amortization schedule
    }
  }
  
  return { interest: totalInterest, principal: totalPrincipal };
}

// Generate Income Statement for a project
export interface IncomeStatement {
  month: Date;
  revenue: number;
  cogs: number;
  grossProfit: number;
  salaries: number;
  opex: number;
  fixedExpenses: number;
  ebitda: number;
  interest: number;
  ebt: number;
  taxes: number;
  netIncome: number;
}

export function generateIncomeStatement(
  month: Date,
  products: RevenueProduct[],
  cogsItems: CogsItem[],
  salaries: Salary[],
  opexItems: OpexItem[],
  fixedExpenses: FixedExpense[],
  fundingSources: FundingSource[],
  projectStartDate: Date,
  taxRate: number = 0.25
): IncomeStatement {
  const revenue = calculateMonthlyRevenue(products, month);
  const cogs = calculateMonthlyCOGS(cogsItems, revenue, products, month, projectStartDate);
  const grossProfit = revenue - cogs;
  
  const salariesTotal = calculateMonthlySalaries(salaries, month);
  const opex = calculateMonthlyOPEX(opexItems, revenue);
  const fixedExpensesTotal = calculateMonthlyFixedExpenses(fixedExpenses, month);
  
  const ebitda = grossProfit - salariesTotal - opex - fixedExpensesTotal;
  
  const debtService = calculateMonthlyDebtService(fundingSources, month, projectStartDate);
  const interest = debtService.interest;
  
  const ebt = ebitda - interest;
  const taxes = ebt > 0 ? ebt * taxRate : 0;
  const netIncome = ebt - taxes;
  
  return {
    month,
    revenue,
    cogs,
    grossProfit,
    salaries: salariesTotal,
    opex,
    fixedExpenses: fixedExpensesTotal,
    ebitda,
    interest,
    ebt,
    taxes,
    netIncome
  };
}

// Generate Cash Flow Statement for a project
export interface CashFlowStatement {
  month: Date;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export function generateCashFlowStatement(
  month: Date,
  incomeStatement: IncomeStatement,
  capexItems: CapexItem[],
  fundingSources: FundingSource[],
  previousCumulativeCashFlow: number = 0
): CashFlowStatement {
  // Operating cash flow (simplified - using net income as proxy)
  const operatingCashFlow = incomeStatement.netIncome;
  
  // Investing cash flow (CAPEX)
  const capex = calculateMonthlyCAPEX(capexItems, month);
  const investingCashFlow = -capex;
  
  // Financing cash flow (debt drawdowns and equity contributions)
  let financingCashFlow = 0;
  for (const source of fundingSources) {
    const sourceDate = new Date(source.date);
    if (sourceDate.getFullYear() === month.getFullYear() && 
        sourceDate.getMonth() === month.getMonth()) {
      financingCashFlow += source.amount;
    }
  }
  
  // Subtract debt service principal
  const debtService = calculateMonthlyDebtService(fundingSources, month, month);
  financingCashFlow -= debtService.principal;
  
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
  const cumulativeCashFlow = previousCumulativeCashFlow + netCashFlow;
  
  return {
    month,
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    netCashFlow,
    cumulativeCashFlow
  };
}

// Calculate KPIs
export interface ProjectKPIs {
  totalRevenue: number;
  totalCOGS: number;
  totalEBITDA: number;
  averageEBITDAMargin: number;
  breakEvenMonth: Date | null;
  roi: number;
  totalInvestment: number;
  totalCashGenerated: number;
}

export function calculateProjectKPIs(
  incomeStatements: IncomeStatement[],
  cashFlowStatements: CashFlowStatement[],
  fundingSources: FundingSource[]
): ProjectKPIs {
  const totalRevenue = incomeStatements.reduce((sum, is) => sum + is.revenue, 0);
  const totalCOGS = incomeStatements.reduce((sum, is) => sum + is.cogs, 0);
  const totalEBITDA = incomeStatements.reduce((sum, is) => sum + is.ebitda, 0);
  const averageEBITDAMargin = totalRevenue > 0 ? (totalEBITDA / totalRevenue) * 100 : 0;
  
  // Find break-even month (first month with positive cumulative cash flow)
  let breakEvenMonth: Date | null = null;
  for (const cf of cashFlowStatements) {
    if (cf.cumulativeCashFlow > 0) {
      breakEvenMonth = cf.month;
      break;
    }
  }
  
  // Calculate ROI
  const totalInvestment = fundingSources.reduce((sum, f) => sum + f.amount, 0);
  const finalCashFlow = cashFlowStatements[cashFlowStatements.length - 1]?.cumulativeCashFlow || 0;
  const totalCashGenerated = finalCashFlow;
  const roi = totalInvestment > 0 ? ((totalCashGenerated - totalInvestment) / totalInvestment) * 100 : 0;
  
  return {
    totalRevenue,
    totalCOGS,
    totalEBITDA,
    averageEBITDAMargin,
    breakEvenMonth,
    roi,
    totalInvestment,
    totalCashGenerated
  };
}
