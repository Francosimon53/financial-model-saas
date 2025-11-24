import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2, Users, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Salaries({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: salaries, isLoading } = trpc.salaries.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    position: "",
    monthlyCost: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: ""
  });

  const utils = trpc.useUtils();

  const createSalary = trpc.salaries.create.useMutation({
    onSuccess: () => {
      toast.success("Posición creada exitosamente");
      utils.salaries.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateSalary = trpc.salaries.update.useMutation({
    onSuccess: () => {
      toast.success("Posición actualizada");
      utils.salaries.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteSalary = trpc.salaries.delete.useMutation({
    onSuccess: () => {
      toast.success("Posición eliminada");
      utils.salaries.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({
      position: "",
      monthlyCost: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: ""
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      position: formData.position,
      monthlyCost: Math.round(parseFloat(formData.monthlyCost) * 100),
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined
    };

    if (editingId) {
      updateSalary.mutate({ id: editingId, ...data });
    } else {
      createSalary.mutate(data);
    }
  };

  const handleEdit = (salary: any) => {
    setEditingId(salary.id);
    setFormData({
      position: salary.position,
      monthlyCost: (salary.monthlyCost / 100).toString(),
      startDate: new Date(salary.startDate).toISOString().split('T')[0],
      endDate: salary.endDate ? new Date(salary.endDate).toISOString().split('T')[0] : ""
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar esta posición?")) {
      deleteSalary.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const totalMonthlyPayroll = salaries?.reduce((sum, s) => sum + s.monthlyCost, 0) || 0;
  const totalAnnualPayroll = totalMonthlyPayroll * 12;

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
          <h1 className="text-3xl font-bold tracking-tight">Salarios y Personal</h1>
          <p className="text-muted-foreground">Gestione el equipo del proyecto y sus costos asociados.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-4 w-4" /> Agregar Posición
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Posición" : "Nueva Posición"}</DialogTitle>
              <DialogDescription>
                Defina el cargo, costo mensual y duración del contrato.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo / Posición</Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Ej: Gerente de Planta"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Costo Mensual (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    required
                    className="pl-7"
                    value={formData.monthlyCost}
                    onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Fecha Inicio</Label>
                  <Input
                    id="start"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Fecha Fin (Opcional)</Label>
                  <Input
                    id="end"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={createSalary.isPending || updateSalary.isPending}>
                  {editingId ? "Guardar Cambios" : "Crear Posición"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Nómina Mensual</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              ${(totalMonthlyPayroll / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
              Costo total por mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nómina Anual Est.</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalAnnualPayroll / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Proyección a 12 meses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaries?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Posiciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/10 border-b border-muted/20">
          <CardTitle>Listado de Personal</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {salaries && salaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No hay personal registrado</h3>
              <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                Comience agregando las posiciones clave para su proyecto y sus costos asociados.
              </p>
              <Button onClick={() => setOpen(true)} variant="outline">
                Agregar Primera Posición
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[30%]">Posición</TableHead>
                  <TableHead>Costo Mensual</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Costo Anual</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaries?.map((salary) => (
                  <TableRow key={salary.id} className="group transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {salary.position.substring(0, 2).toUpperCase()}
                        </div>
                        {salary.position}
                      </div>
                    </TableCell>
                    <TableCell>${(salary.monthlyCost / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{format(new Date(salary.startDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {salary.endDate ? format(new Date(salary.endDate), 'MMM d, yyyy') : <span className="text-muted-foreground/50">—</span>}
                    </TableCell>
                    <TableCell className="font-medium text-green-600 dark:text-green-400">
                      ${((salary.monthlyCost * 12) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(salary)}>
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(salary.id)}>
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
