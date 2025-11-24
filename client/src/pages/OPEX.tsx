import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2, TrendingDown, DollarSign, Percent } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function OPEX({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: opexItems, isLoading } = trpc.opex.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    expenseType: "fixed" as "fixed" | "percentage",
    amount: ""
  });

  const utils = trpc.useUtils();

  const createOpex = trpc.opex.create.useMutation({
    onSuccess: () => {
      toast.success("Gasto operativo creado exitosamente");
      utils.opex.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateOpex = trpc.opex.update.useMutation({
    onSuccess: () => {
      toast.success("Gasto operativo actualizado");
      utils.opex.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteOpex = trpc.opex.delete.useMutation({
    onSuccess: () => {
      toast.success("Gasto operativo eliminado");
      utils.opex.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({
      name: "",
      expenseType: "fixed",
      amount: ""
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      name: formData.name,
      expenseType: formData.expenseType,
      amount: Math.round(parseFloat(formData.amount) * 100)
    };

    if (editingId) {
      updateOpex.mutate({ id: editingId, ...data });
    } else {
      createOpex.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      expenseType: item.expenseType,
      amount: (item.amount / 100).toString()
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este gasto?")) {
      deleteOpex.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  // Calculate total fixed monthly OPEX (percentage based depends on revenue, so we sum fixed only here)
  const totalFixedMonthlyOpex = opexItems
    ?.filter(item => item.expenseType === "fixed")
    .reduce((sum, item) => sum + item.amount, 0) || 0;

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
          <h1 className="text-3xl font-bold tracking-tight">Gastos Operativos (OPEX)</h1>
          <p className="text-muted-foreground">Gestione los gastos recurrentes y variables del proyecto.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" /> Agregar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
              <DialogDescription>
                Defina el tipo de gasto y su monto o porcentaje.
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
                  <Label htmlFor="type">Tipo de Gasto</Label>
                  <Select
                    value={formData.expenseType}
                    onValueChange={(v: "fixed" | "percentage") => setFormData({ ...formData, expenseType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Monto Fijo</SelectItem>
                      <SelectItem value="percentage">% de Ingresos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {formData.expenseType === "fixed" ? "Monto Mensual (USD)" : "Porcentaje (%)"}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      {formData.expenseType === "fixed" ? "$" : <Percent className="h-4 w-4" />}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      required
                      className="pl-9"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={createOpex.isPending || updateOpex.isPending}>
                  {editingId ? "Guardar Cambios" : "Crear Gasto"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-100 dark:border-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">OPEX Fijo Mensual</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              ${(totalFixedMonthlyOpex / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">
              Gastos fijos recurrentes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Variables</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {opexItems?.filter(i => i.expenseType === "percentage").length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items basados en % de ingresos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opexItems?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Conceptos de gasto registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-muted/20">
          <CardTitle>Listado de Gastos Operativos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {opexItems && opexItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <TrendingDown className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No hay gastos registrados</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Comience agregando los gastos operativos recurrentes de su proyecto.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Agregar Primer Gasto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40%]">Concepto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opexItems?.map((item) => (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                          <TrendingDown className="h-4 w-4" />
                        </div>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.expenseType === 'fixed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                        {item.expenseType === 'fixed' ? 'Fijo' : 'Variable (%)'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.expenseType === 'fixed'
                        ? `$${(item.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} / mes`
                        : `${(item.amount / 100).toFixed(2)}% de Ingresos`
                      }
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
