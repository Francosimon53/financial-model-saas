import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Revenue({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = trpc.revenue.list.useQuery({ projectId });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    averagePrice: "",
    volume: "",
    unit: "",
    seasonalityFactor: "100"
  });

  const utils = trpc.useUtils();

  const createProduct = trpc.revenue.create.useMutation({
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      utils.revenue.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const updateProduct = trpc.revenue.update.useMutation({
    onSuccess: () => {
      toast.success("Producto actualizado");
      utils.revenue.list.invalidate({ projectId });
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const deleteProduct = trpc.revenue.delete.useMutation({
    onSuccess: () => {
      toast.success("Producto eliminado");
      utils.revenue.list.invalidate({ projectId });
    },
    onError: (error) => toast.error("Error: " + error.message)
  });

  const resetForm = () => {
    setFormData({ name: "", averagePrice: "", volume: "", unit: "", seasonalityFactor: "100" });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      name: formData.name,
      averagePrice: Math.round(parseFloat(formData.averagePrice) * 100),
      volume: parseInt(formData.volume),
      unit: formData.unit,
      seasonalityFactor: parseInt(formData.seasonalityFactor)
    };

    if (editingId) {
      updateProduct.mutate({ id: editingId, ...data });
    } else {
      createProduct.mutate(data);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      averagePrice: (product.averagePrice / 100).toString(),
      volume: product.volume.toString(),
      unit: product.unit,
      seasonalityFactor: product.seasonalityFactor.toString()
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de eliminar este producto?")) {
      deleteProduct.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  const totalRevenue = products?.reduce((sum, p) => sum + (p.averagePrice * p.volume * p.seasonalityFactor / 100), 0) || 0;

  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => setLocation(`/project/${projectId}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Proyecto
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Ingresos</h1>
          <p className="text-gray-600 mt-2">Configure productos, precios y volúmenes de venta</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Agregar Producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
              <DialogDescription>Configure los detalles del producto o servicio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nombre del Producto</Label><Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Gasolina Premium" /></div>
              <div><Label>Precio Promedio (USD)</Label><Input type="number" step="0.01" required value={formData.averagePrice} onChange={(e) => setFormData({...formData, averagePrice: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Volumen</Label><Input type="number" required value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} /></div>
                <div><Label>Unidad</Label><Input required value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} placeholder="Ej: barriles, litros" /></div>
              </div>
              <div><Label>Factor de Estacionalidad (%)</Label><Input type="number" required value={formData.seasonalityFactor} onChange={(e) => setFormData({...formData, seasonalityFactor: e.target.value})} /></div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>{editingId ? "Actualizar" : "Crear"} Producto</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumen de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">${(totalRevenue / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <p className="text-sm text-gray-600 mt-1">Ingresos proyectados totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay productos configurados. Agregue su primer producto para comenzar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Volumen</TableHead>
                  <TableHead>Estacionalidad</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${(product.averagePrice / 100).toFixed(2)}</TableCell>
                    <TableCell>{product.volume.toLocaleString()} {product.unit}</TableCell>
                    <TableCell>{product.seasonalityFactor}%</TableCell>
                    <TableCell className="font-semibold">${((product.averagePrice * product.volume * product.seasonalityFactor / 10000)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
