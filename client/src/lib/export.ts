import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export interface IncomeStatementRow {
  month: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  salaries: number;
  opex: number;
  fixedExpenses: number;
  ebitda: number;
  capex: number;
  netIncome: number;
}

export interface CashFlowRow {
  month: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export function exportIncomeStatementToPDF(
  projectName: string,
  data: IncomeStatementRow[]
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Income Statement - ${projectName}`, 14, 20);
  
  // Headers
  doc.setFontSize(10);
  let y = 35;
  const headers = ["Mes", "Ingresos", "COGS", "Utilidad Bruta", "Salarios", "OPEX", "EBITDA"];
  const x = [14, 40, 70, 100, 130, 160, 190];
  
  headers.forEach((header, i) => {
    doc.text(header, x[i], y);
  });
  
  // Data rows
  y += 7;
  doc.setFontSize(9);
  data.slice(0, 30).forEach((row) => {
    doc.text(row.month, x[0], y);
    doc.text(`$${(row.revenue / 100).toFixed(0)}`, x[1], y);
    doc.text(`$${(row.cogs / 100).toFixed(0)}`, x[2], y);
    doc.text(`$${(row.grossProfit / 100).toFixed(0)}`, x[3], y);
    doc.text(`$${(row.salaries / 100).toFixed(0)}`, x[4], y);
    doc.text(`$${(row.opex / 100).toFixed(0)}`, x[5], y);
    doc.text(`$${(row.ebitda / 100).toFixed(0)}`, x[6], y);
    y += 6;
    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  doc.save(`${projectName}_income_statement.pdf`);
}

export function exportCashFlowToPDF(
  projectName: string,
  data: CashFlowRow[]
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Cash Flow Statement - ${projectName}`, 14, 20);
  
  // Headers
  doc.setFontSize(10);
  let y = 35;
  const headers = ["Mes", "Operativo", "Inversión", "Financiamiento", "Flujo Neto", "Acumulado"];
  const x = [14, 40, 70, 110, 150, 180];
  
  headers.forEach((header, i) => {
    doc.text(header, x[i], y);
  });
  
  // Data rows
  y += 7;
  doc.setFontSize(9);
  data.slice(0, 30).forEach((row) => {
    doc.text(row.month, x[0], y);
    doc.text(`$${(row.operatingCashFlow / 100).toFixed(0)}`, x[1], y);
    doc.text(`$${(row.investingCashFlow / 100).toFixed(0)}`, x[2], y);
    doc.text(`$${(row.financingCashFlow / 100).toFixed(0)}`, x[3], y);
    doc.text(`$${(row.netCashFlow / 100).toFixed(0)}`, x[4], y);
    doc.text(`$${(row.cumulativeCashFlow / 100).toFixed(0)}`, x[5], y);
    y += 6;
    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  doc.save(`${projectName}_cash_flow.pdf`);
}

export function exportToExcel(
  projectName: string,
  incomeStatement: IncomeStatementRow[],
  cashFlow: CashFlowRow[]
) {
  const wb = XLSX.utils.book_new();
  
  // Income Statement sheet
  const isData = incomeStatement.map(row => ({
    "Mes": row.month,
    "Ingresos": row.revenue / 100,
    "COGS": row.cogs / 100,
    "Utilidad Bruta": row.grossProfit / 100,
    "Salarios": row.salaries / 100,
    "OPEX": row.opex / 100,
    "Gastos Fijos": row.fixedExpenses / 100,
    "EBITDA": row.ebitda / 100,
    "CAPEX": row.capex / 100,
    "Utilidad Neta": row.netIncome / 100,
  }));
  
  const isSheet = XLSX.utils.json_to_sheet(isData);
  XLSX.utils.book_append_sheet(wb, isSheet, "Income Statement");
  
  // Cash Flow sheet
  const cfData = cashFlow.map(row => ({
    "Mes": row.month,
    "Flujo Operativo": row.operatingCashFlow / 100,
    "Flujo de Inversión": row.investingCashFlow / 100,
    "Flujo de Financiamiento": row.financingCashFlow / 100,
    "Flujo Neto": row.netCashFlow / 100,
    "Flujo Acumulado": row.cumulativeCashFlow / 100,
  }));
  
  const cfSheet = XLSX.utils.json_to_sheet(cfData);
  XLSX.utils.book_append_sheet(wb, cfSheet, "Cash Flow");
  
  // Write file
  XLSX.writeFile(wb, `${projectName}_financial_statements.xlsx`);
}
