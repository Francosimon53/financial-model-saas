import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function COGS({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: items, isLoading } = trpc.cogs.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    costType: "fixed" as "fixed" | "variable" | "percentage",
    amount: "",
    growthRate: "0"
  });

  const utils = trpc.useUtils();

  const createItem = trpc.cogs.create.useMutation({
    onSuccess: () => {
      toast.success("COGS creado exitosamente");
      utils.cogs.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    }
  });

  const updateItem = trpc.cogs.update.useMutation({
    onSuccess: () => {
      toast.success("COGS actualizado");
      utils.cogs.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    }
  });

  const deleteItem = trpc.cogs.delete.useMutation({
    onSuccess: () => {
      toast.success("COGS eliminado");
      utils.cogs.list.invalidate({ projectId });
    }
  });

  const resetForm = () => {
    setFormData({ name: "", costType: "fixed", amount: "", growthRate: "0" });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      name: formData.name,
      costType: formData.costType,
      amount: formData.costType === "percentage" ? parseInt(formData.amount) * 100 : Math.round(parseFloat(formData.amount) * 100),
      growthRate: parseInt(formData.growthRate)
    };

    if (editingId) {
      updateItem.mutate({ id: editingId, ...data });
    } else {
      createItem.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      costType: item.costType,
      amount: item.costType === "percentage" ? (item.amount / 100).toString() : (item.amount / 100).toString(),
      growthRate: item.growthRate.toString()
    });
    setOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => setLocation(`/project/${projectId}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Proyecto
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Costos Directos (COGS)</h1>
          <p className="text-gray-600 mt-2">Configure costos de materia prima y otros costos directos</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Agregar COGS</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar COGS" : "Nuevo COGS"}</DialogTitle>
              <DialogDescription>Configure los costos directos de producción</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nombre</Label><Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Crude Feedstock Cost" /></div>
              <div><Label>Tipo de Costo</Label><Select value={formData.costType} onValueChange={(v: any) => setFormData({...formData, costType: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Fijo</SelectItem><SelectItem value="variable">Variable</SelectItem><SelectItem value="percentage">Porcentaje de Ingresos</SelectItem></SelectContent></Select></div>
              <div><Label>{formData.costType === "percentage" ? "Porcentaje (%)" : "Monto (USD)"}</Label><Input type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} /></div>
              <div><Label>Crecimiento Anual (puntos básicos)</Label><Input type="number" required value={formData.growthRate} onChange={(e) => setFormData({...formData, growthRate: e.target.value})} /></div>
              <Button type="submit" className="w-full">{editingId ? "Actualizar" : "Crear"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Items de COGS</CardTitle></CardHeader>
        <CardContent>
          {items && items.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><p>No hay items de COGS configurados.</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead>Monto</TableHead><TableHead>Crecimiento</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.costType === "fixed" ? "Fijo" : item.costType === "variable" ? "Variable" : "Porcentaje"}</TableCell>
                    <TableCell>{item.costType === "percentage" ? `${item.amount / 100}%` : `$${(item.amount / 100).toFixed(2)}`}</TableCell>
                    <TableCell>{item.growthRate} bps</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("¿Eliminar?")) deleteItem.mutate({ id: item.id }); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
