import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function CAPEX({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: capexItems, isLoading } = trpc.capex.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    paymentDelay: "0"
  });

  const utils = trpc.useUtils();

  const createCapex = trpc.capex.create.useMutation({
    onSuccess: () => {
      toast.success("Inversión de capital creada exitosamente");
      utils.capex.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateCapex = trpc.capex.update.useMutation({
    onSuccess: () => {
      toast.success("Inversión de capital actualizada");
      utils.capex.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteCapex = trpc.capex.delete.useMutation({
    onSuccess: () => {
      toast.success("Inversión de capital eliminada");
      utils.capex.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      paymentDelay: "0"
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      name: formData.name,
      amount: Math.round(parseFloat(formData.amount) * 100),
      purchaseDate: new Date(formData.purchaseDate),
      paymentDelay: parseInt(formData.paymentDelay)
    };

    if (editingId) {
      updateCapex.mutate({ id: editingId, ...data });
    } else {
      createCapex.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      amount: (item.amount / 100).toString(),
      purchaseDate: new Date(item.purchaseDate).toISOString().split('T')[0],
      paymentDelay: item.paymentDelay.toString()
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta inversión?")) {
      deleteCapex.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const totalCapex = capexItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const avgPaymentDelay = capexItems?.length
    ? Math.round(capexItems.reduce((sum, item) => sum + item.paymentDelay, 0) / capexItems.length)
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
          <h1 className="text-3xl font-bold tracking-tight">Inversiones de Capital (CAPEX)</h1>
          <p className="text-muted-foreground">Gestione inversiones en equipos, maquinaria e infraestructura.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" /> Agregar CAPEX
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Inversión" : "Nueva Inversión"}</DialogTitle>
              <DialogDescription>
                Registre inversiones de capital como equipos, maquinaria o infraestructura.
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
                  placeholder="Ej: Maquinaria de Producción"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto de Inversión (USD)</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDelay">Diferimiento (días)</Label>
                  <Input
                    id="paymentDelay"
                    type="number"
                    min="0"
                    required
                    value={formData.paymentDelay}
                    onChange={(e) => setFormData({ ...formData, paymentDelay: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={createCapex.isPending || updateCapex.isPending}>
                  {editingId ? "Guardar Cambios" : "Crear Inversión"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-100 dark:border-indigo-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Inversión Total</CardTitle>
            <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              ${(totalCapex / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 mt-1">
              Capital total invertido
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diferimiento Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPaymentDelay}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Días de pago diferido
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capexItems?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Inversiones registradas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-muted/20">
          <CardTitle>Listado de Inversiones de Capital</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {capexItems && capexItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No hay inversiones registradas</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Comience agregando inversiones de capital como equipos, maquinaria o infraestructura.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Agregar Primera Inversión
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[35%]">Concepto</TableHead>
                  <TableHead>Fecha de Compra</TableHead>
                  <TableHead>Diferimiento</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capexItems?.map((item) => (
                  <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.purchaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        {item.paymentDelay} días
                      </span>
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
