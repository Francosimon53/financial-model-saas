import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2, TrendingUp, DollarSign, Percent } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Funding({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: fundingSources, isLoading } = trpc.funding.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    sourceType: "equity" as "equity" | "debt",
    amount: "",
    interestRate: "0",
    date: new Date().toISOString().split('T')[0]
  });

  const utils = trpc.useUtils();

  const createFunding = trpc.funding.create.useMutation({
    onSuccess: () => {
      toast.success("Fuente de financiamiento creada exitosamente");
      utils.funding.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateFunding = trpc.funding.update.useMutation({
    onSuccess: () => {
      toast.success("Fuente de financiamiento actualizada");
      utils.funding.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteFunding = trpc.funding.delete.useMutation({
    onSuccess: () => {
      toast.success("Fuente de financiamiento eliminada");
      utils.funding.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({
      sourceType: "equity",
      amount: "",
      interestRate: "0",
      date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      sourceType: formData.sourceType,
      amount: Math.round(parseFloat(formData.amount) * 100),
      interestRate: Math.round(parseFloat(formData.interestRate) * 100), // basis points
      date: new Date(formData.date)
    };

    if (editingId) {
      updateFunding.mutate({ id: editingId, ...data });
    } else {
      createFunding.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      sourceType: item.sourceType,
      amount: (item.amount / 100).toString(),
      interestRate: (item.interestRate / 100).toString(),
      date: new Date(item.date).toISOString().split('T')[0]
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta fuente de financiamiento?")) {
      deleteFunding.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const totalFunding = fundingSources?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalEquity = fundingSources?.filter(s => s.sourceType === "equity").reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalDebt = fundingSources?.filter(s => s.sourceType === "debt").reduce((sum, item) => sum + item.amount, 0) || 0;

  // Calculate weighted average interest rate for debt
  const debtSources = fundingSources?.filter(s => s.sourceType === "debt") || [];
  const weightedInterestRate = debtSources.length > 0
    ? debtSources.reduce((sum, item) => sum + (item.amount * item.interestRate), 0) / totalDebt
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setLocation(`/project/${projectId}`)}
            className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Proyecto
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Fuentes de Financiamiento</h1>
          <p className="text-muted-foreground">Gestione capital propio (equity) y deuda para financiar el proyecto.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" /> Agregar Financiamiento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Financiamiento" : "Nuevo Financiamiento"}</DialogTitle>
              <DialogDescription>
                Registre fuentes de capital propio o deuda para financiar el proyecto.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Tipo de Financiamiento</Label>
                <Select
                  value={formData.sourceType}
                  onValueChange={(v: "equity" | "debt") => setFormData({ ...formData, sourceType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity">Capital Propio (Equity)</SelectItem>
                    <SelectItem value="debt">Deuda (Debt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    required
                    className="pl-7"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
              {formData.sourceType === "debt" && (
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Tasa de Interés Anual (%)</Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      required
                      className="pr-7"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    />
                    <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de Recepción</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={createFunding.isPending || updateFunding.isPending}>
                  {editingId ? "Guardar Cambios" : "Crear Financiamiento"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-100 dark:border-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Total Financiamiento</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              ${(totalFunding / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Capital total del proyecto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capital Propio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalEquity / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalFunding > 0 ? `${((totalEquity / totalFunding) * 100).toFixed(1)}% del total` : "0% del total"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalDebt / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalFunding > 0 ? `${((totalDebt / totalFunding) * 100).toFixed(1)}% del total` : "0% del total"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Promedio</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(weightedInterestRate / 100).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasa ponderada de deuda
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-muted/20">
          <CardTitle>Listado de Fuentes de Financiamiento</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {fundingSources && fundingSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No hay fuentes de financiamiento</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Comience agregando capital propio o deuda para financiar su proyecto.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Agregar Primera Fuente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[25%]">Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Tasa de Interés</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingSources?.map((item) => (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${item.sourceType === 'equity'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          }`}>
                          {item.sourceType === 'equity' ? <TrendingUp className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.sourceType === 'equity'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                          {item.sourceType === 'equity' ? 'Capital Propio' : 'Deuda'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(item.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {item.sourceType === 'debt' ? (
                        <span className="font-medium">{(item.interestRate / 100).toFixed(2)}%</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(item)}>
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500/70 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
