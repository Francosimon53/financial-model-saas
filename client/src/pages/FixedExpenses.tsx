import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2, Calendar, DollarSign, Repeat } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function FixedExpenses({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: expenses, isLoading } = trpc.fixedExpenses.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    frequency: "monthly" as "once" | "monthly" | "quarterly" | "annually"
  });

  const utils = trpc.useUtils();

  const createExpense = trpc.fixedExpenses.create.useMutation({
    onSuccess: () => {
      toast.success("Gasto fijo creado exitosamente");
      utils.fixedExpenses.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateExpense = trpc.fixedExpenses.update.useMutation({
    onSuccess: () => {
      toast.success("Gasto fijo actualizado");
      utils.fixedExpenses.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteExpense = trpc.fixedExpenses.delete.useMutation({
    onSuccess: () => {
      toast.success("Gasto fijo eliminado");
      utils.fixedExpenses.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      frequency: "monthly"
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      name: formData.name,
      amount: Math.round(parseFloat(formData.amount) * 100),
      date: new Date(formData.date),
      frequency: formData.frequency
    };

    if (editingId) {
      updateExpense.mutate({ id: editingId, ...data });
    } else {
      createExpense.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      amount: (item.amount / 100).toString(),
      date: new Date(item.date).toISOString().split('T')[0],
      frequency: item.frequency
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este gasto?")) {
      deleteExpense.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Calculate monthly equivalent for all expenses
  const calculateMonthlyEquivalent = (amount: number, frequency: string) => {
    switch (frequency) {
      case "once": return 0; // One-time expenses don't contribute to monthly
      case "monthly": return amount;
      case "quarterly": return amount / 3;
      case "annually": return amount / 12;
      default: return 0;
    }
  };

  const totalMonthlyEquivalent = expenses?.reduce(
    (sum, item) => sum + calculateMonthlyEquivalent(item.amount, item.frequency),
    0
  ) || 0;

  const frequencyLabels: Record<string, string> = {
    once: "Una vez",
    monthly: "Mensual",
    quarterly: "Trimestral",
    annually: "Anual"
  };

  const frequencyColors: Record<string, string> = {
    once: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    monthly: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    quarterly: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    annually: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Gastos Fijos</h1>
          <p className="text-muted-foreground">Gestione mantenimientos, seguros y gastos recurrentes programados.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" /> Agregar Gasto Fijo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Gasto Fijo" : "Nuevo Gasto Fijo"}</DialogTitle>
              <DialogDescription>
                Defina gastos recurrentes como alquiler, seguros o mantenimientos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Concepto</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Alquiler de Oficina"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frecuencia</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(v: "once" | "monthly" | "quarterly" | "annually") => setFormData({ ...formData, frequency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Una vez</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="annually">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de Inicio</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={createExpense.isPending || updateExpense.isPending}>
                  {editingId ? "Guardar Cambios" : "Crear Gasto Fijo"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-100 dark:border-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Equivalente Mensual</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              ${(totalMonthlyEquivalent / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
              Promedio mensual de gastos fijos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Recurrentes</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses?.filter(e => e.frequency !== "once").length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items con frecuencia definida
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gastos fijos registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-muted/20">
          <CardTitle>Listado de Gastos Fijos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {expenses && expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No hay gastos fijos registrados</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Comience agregando gastos recurrentes como alquiler, seguros o mantenimientos.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Agregar Primer Gasto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[35%]">Concepto</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses?.map((item) => (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                          <Calendar className="h-4 w-4" />
                        </div>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${frequencyColors[item.frequency]}`}>
                        {frequencyLabels[item.frequency]}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(item.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
