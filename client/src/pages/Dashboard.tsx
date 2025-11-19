import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportIncomeStatementToPDF, exportCashFlowToPDF, exportToExcel } from "@/lib/export";
import { toast } from "sonner";

interface DashboardProps {
  projectId: number;
}

export default function Dashboard({ projectId }: DashboardProps) {
  const { data: project } = trpc.projects.getById.useQuery({ id: projectId });
  const { data: incomeStatements } = trpc.financial.incomeStatement.useQuery({ projectId });
  const { data: cashFlowStatements } = trpc.financial.cashFlow.useQuery({ projectId });
  const { data: kpis } = trpc.financial.kpis.useQuery({ projectId });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (incomeStatements && cashFlowStatements) {
      const data = incomeStatements.map((is: any, index: number) => {
        const cf = cashFlowStatements[index];
        return {
          month: is.month,
          revenue: is.revenue / 100,
          cogs: is.cogs / 100,
          ebitda: is.ebitda / 100,
          cashFlow: cf ? cf.netCashFlow / 100 : 0,
          cumulativeCash: cf ? cf.cumulativeCashFlow / 100 : 0,
        };
      });
      setChartData(data);
    }
  }, [incomeStatements, cashFlowStatements]);

  const handleExportPDF = () => {
    if (!incomeStatements || !cashFlowStatements || !project) return;
    
    const isData = incomeStatements.map((is: any) => ({
      month: is.month,
      revenue: is.revenue,
      cogs: is.cogs,
      grossProfit: is.grossProfit,
      salaries: is.salaries,
      opex: is.opex,
      fixedExpenses: is.fixedExpenses,
      ebitda: is.ebitda,
      capex: is.capex,
      netIncome: is.netIncome,
    }));
    
    exportIncomeStatementToPDF(project.name, isData);
    toast.success("Income Statement exportado a PDF");
  };

  const handleExportExcel = () => {
    if (!incomeStatements || !cashFlowStatements || !project) return;
    
    const isData = incomeStatements.map((is: any) => ({
      month: is.month,
      revenue: is.revenue,
      cogs: is.cogs,
      grossProfit: is.grossProfit,
      salaries: is.salaries,
      opex: is.opex,
      fixedExpenses: is.fixedExpenses,
      ebitda: is.ebitda,
      capex: is.capex,
      netIncome: is.netIncome,
    }));
    
    const cfData = cashFlowStatements.map((cf: any) => ({
      month: cf.month,
      operatingCashFlow: cf.operatingCashFlow,
      investingCashFlow: cf.investingCashFlow,
      financingCashFlow: cf.financingCashFlow,
      netCashFlow: cf.netCashFlow,
      cumulativeCashFlow: cf.cumulativeCashFlow,
    }));
    
    exportToExcel(project.name, isData, cfData);
    toast.success("Estados financieros exportados a Excel");
  };

  if (!project) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/project/${projectId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">{project.name}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EBITDA Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${kpis?.averageEbitda ? (kpis.averageEbitda / 100).toFixed(0) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis?.averageEbitda && kpis.averageEbitda > 0 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Positivo
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Negativo
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen EBITDA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis?.ebitdaMargin ? `${kpis.ebitdaMargin.toFixed(1)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              Margen sobre ingresos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis?.roi ? `${kpis.roi.toFixed(1)}%` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Retorno de inversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break-Even</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis?.breakEvenMonth || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Mes de equilibrio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Costs Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Costos</CardTitle>
          <CardDescription>Evolución mensual de ingresos y costos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Ingresos" strokeWidth={2} />
              <Line type="monotone" dataKey="cogs" stroke="#ef4444" name="COGS" strokeWidth={2} />
              <Line type="monotone" dataKey="ebitda" stroke="#3b82f6" name="EBITDA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo de Efectivo</CardTitle>
          <CardDescription>Flujo de efectivo mensual y acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
              <Legend />
              <Bar dataKey="cashFlow" fill="#8b5cf6" name="Flujo Mensual" />
              <Bar dataKey="cumulativeCash" fill="#06b6d4" name="Flujo Acumulado" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* EBITDA Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia EBITDA</CardTitle>
          <CardDescription>Evolución del EBITDA a lo largo del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(0)}`} />
              <Line type="monotone" dataKey="ebitda" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
