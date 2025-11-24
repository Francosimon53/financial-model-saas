import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function FinancialStatements({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: incomeStatements, isLoading: isLoadingIS, refetch: refetchIS } = trpc.financial.incomeStatement.useQuery({ projectId });
  const { data: cashFlowStatements, isLoading: isLoadingCF, refetch: refetchCF } = trpc.financial.cashFlow.useQuery({ projectId });

  // Aggregate totals from arrays
  const incomeStatement = incomeStatements && incomeStatements.length > 0 ? {
    totalRevenue: incomeStatements.reduce((sum: number, s: any) => sum + s.revenue, 0),
    totalCOGS: incomeStatements.reduce((sum: number, s: any) => sum + s.cogs, 0),
    grossMargin: incomeStatements.reduce((sum: number, s: any) => sum + (s.revenue - s.cogs), 0),
    totalSalaries: incomeStatements.reduce((sum: number, s: any) => sum + s.salaries, 0),
    totalOPEX: incomeStatements.reduce((sum: number, s: any) => sum + s.opex, 0),
    totalFixedExpenses: incomeStatements.reduce((sum: number, s: any) => sum + s.fixedExpenses, 0),
    ebitda: incomeStatements.reduce((sum: number, s: any) => sum + s.ebitda, 0),
    depreciation: 0,
    ebit: incomeStatements.reduce((sum: number, s: any) => sum + s.ebitda, 0),
    interestExpense: incomeStatements.reduce((sum: number, s: any) => sum + s.interest, 0),
    ebt: incomeStatements.reduce((sum: number, s: any) => sum + s.ebt, 0),
    taxes: incomeStatements.reduce((sum: number, s: any) => sum + s.taxes, 0),
    netIncome: incomeStatements.reduce((sum: number, s: any) => sum + s.netIncome, 0)
  } : null;

  const cashFlow = cashFlowStatements && cashFlowStatements.length > 0 ? {
    netIncome: incomeStatement?.netIncome || 0,
    depreciation: 0,
    operatingCashFlow: cashFlowStatements.reduce((sum: number, s: any) => sum + s.operatingCashFlow, 0),
    capex: cashFlowStatements.reduce((sum: number, s: any) => sum + Math.abs(s.investingCashFlow), 0),
    investingCashFlow: cashFlowStatements.reduce((sum: number, s: any) => sum + s.investingCashFlow, 0),
    debtProceeds: 0,
    equityProceeds: 0,
    interestPayments: incomeStatement?.interestExpense || 0,
    financingCashFlow: cashFlowStatements.reduce((sum: number, s: any) => sum + s.financingCashFlow, 0),
    netCashFlow: cashFlowStatements.reduce((sum: number, s: any) => sum + s.netCashFlow, 0)
  } : null;

  const handleRefresh = () => {
    refetchIS();
    refetchCF();
    toast.success("Estados financieros actualizados");
  };

  const handleExport = () => {
    toast.info("Funcionalidad de exportación en desarrollo");
  };

  if (isLoadingIS || isLoadingCF) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => setLocation(`/project/${projectId}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Proyecto
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Estados Financieros</h1>
          <p className="text-gray-600 mt-2">Income Statement y Cash Flow generados automáticamente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow Statement</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Statement (Estado de Resultados)</CardTitle>
            </CardHeader>
            <CardContent>
              {incomeStatement ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Concepto</TableHead>
                      <TableHead className="text-right">Monto (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-semibold bg-green-50">
                      <TableCell>Ingresos Totales</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(incomeStatement.totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- COGS (Costos Directos)</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.totalCOGS / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>Margen Bruto</TableCell>
                      <TableCell className="text-right">
                        ${(incomeStatement.grossMargin / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Salarios</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.totalSalaries / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- OPEX</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.totalOPEX / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Gastos Fijos</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.totalFixedExpenses / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-bold bg-blue-50">
                      <TableCell>EBITDA</TableCell>
                      <TableCell className="text-right text-blue-600">
                        ${(incomeStatement.ebitda / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Depreciación</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.depreciation / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>EBIT</TableCell>
                      <TableCell className="text-right">
                        ${(incomeStatement.ebit / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Intereses</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.interestExpense / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>Utilidad Antes de Impuestos</TableCell>
                      <TableCell className="text-right">
                        ${(incomeStatement.ebt / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Impuestos</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(incomeStatement.taxes / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-bold text-lg bg-indigo-50">
                      <TableCell>Utilidad Neta</TableCell>
                      <TableCell className="text-right text-indigo-600">
                        ${(incomeStatement.netIncome / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No hay datos suficientes para generar el Income Statement.</p>
                  <p className="text-sm mt-2">Configure al menos productos de ingresos en el módulo de Revenue.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement (Estado de Flujo de Efectivo)</CardTitle>
            </CardHeader>
            <CardContent>
              {cashFlow ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Concepto</TableHead>
                      <TableHead className="text-right">Monto (USD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-semibold bg-gray-100">
                      <TableCell colSpan={2}>Flujo de Efectivo de Operaciones</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">Utilidad Neta</TableCell>
                      <TableCell className="text-right">
                        ${(cashFlow.netIncome / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">+ Depreciación</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(cashFlow.depreciation / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>Flujo de Operaciones</TableCell>
                      <TableCell className="text-right">
                        ${(cashFlow.operatingCashFlow / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold bg-gray-100">
                      <TableCell colSpan={2}>Flujo de Efectivo de Inversiones</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- CAPEX</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(cashFlow.capex / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>Flujo de Inversiones</TableCell>
                      <TableCell className="text-right">
                        ${(cashFlow.investingCashFlow / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold bg-gray-100">
                      <TableCell colSpan={2}>Flujo de Efectivo de Financiamiento</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">+ Deuda</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(cashFlow.debtProceeds / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">+ Equity</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(cashFlow.equityProceeds / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="pl-8">- Pago de Intereses</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(cashFlow.interestPayments / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-semibold">
                      <TableCell>Flujo de Financiamiento</TableCell>
                      <TableCell className="text-right">
                        ${(cashFlow.financingCashFlow / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>

                    <TableRow className="font-bold text-lg bg-indigo-50">
                      <TableCell>Flujo de Efectivo Neto</TableCell>
                      <TableCell className="text-right text-indigo-600">
                        ${(cashFlow.netCashFlow / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No hay datos suficientes para generar el Cash Flow Statement.</p>
                  <p className="text-sm mt-2">Configure los módulos de ingresos, costos y financiamiento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
