import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Check } from "lucide-react";

const templates = [
  {
    id: "refinery",
    name: "Refinería de Petróleo",
    description: "Modelo financiero para refinería con capacidad de 180,000 barriles/día. Incluye proyecciones de gasolina, diesel, jet fuel y fuel oil.",
    industry: "Energía y Petróleo",
    icon: "⚡",
    features: ["4 productos de ingresos", "3 ítems de COGS", "4 posiciones de salarios", "120 meses de proyección"],
  },
  {
    id: "chemical_plant",
    name: "Planta Química",
    description: "Modelo financiero para planta de producción química industrial con productos especializados.",
    industry: "Química",
    icon: "🧪",
    features: ["3 productos químicos", "3 ítems de COGS", "3 posiciones clave", "96 meses de proyección"],
  },
  {
    id: "solar_farm",
    name: "Granja Solar",
    description: "Modelo financiero para proyecto de energía solar fotovoltaica con venta de energía y certificados verdes.",
    industry: "Energías Renovables",
    icon: "☀️",
    features: ["Venta de energía", "Certificados verdes", "Bajo mantenimiento", "240 meses (20 años)"],
  },
  {
    id: "blank",
    name: "Proyecto en Blanco",
    description: "Comienza desde cero con un proyecto personalizado sin datos precargados.",
    industry: "General",
    icon: "📄",
    features: ["Totalmente personalizable", "Sin datos predefinidos", "Duración flexible", "Para cualquier industria"],
  },
];

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateSelector({ open, onClose }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [, setLocation] = useLocation();
  const createProject = trpc.projects.create.useMutation();

  const handleCreate = async () => {
    if (!projectName.trim()) {
      toast.error("Por favor ingresa un nombre para el proyecto");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Por favor selecciona una plantilla");
      return;
    }

    try {
      const startDate = new Date();
      const duration = selectedTemplate === "refinery" ? 120 : selectedTemplate === "chemical_plant" ? 96 : selectedTemplate === "solar_farm" ? 240 : 60;
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);

      const result = await createProject.mutateAsync({
        name: projectName,
        description: `Proyecto basado en plantilla: ${templates.find(t => t.id === selectedTemplate)?.name}`,
        startDate,
        endDate,
        industry: templates.find(t => t.id === selectedTemplate)?.industry || "",
        currency: "USD",
      });

      // Store template ID in localStorage for later use
      if (result && 'insertId' in result) {
        localStorage.setItem(`project_${result.insertId}_template`, selectedTemplate);
        toast.success("Proyecto creado exitosamente");
        onClose();
        setLocation(`/project/${result.insertId}`);
      } else {
        toast.success("Proyecto creado exitosamente");
        onClose();
        // Refresh projects list
        window.location.href = '/projects';
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear el proyecto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecciona una Plantilla</DialogTitle>
          <DialogDescription>
            Elige una plantilla de industria para comenzar con datos precargados, o inicia desde cero.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="projectName">Nombre del Proyecto</Label>
            <Input
              id="projectName"
              placeholder="Ej: Refinería Port Hamilton"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  selectedTemplate === template.id ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{template.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{template.industry}</p>
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!selectedTemplate || !projectName.trim() || createProject.isPending}>
              {createProject.isPending ? "Creando..." : "Crear Proyecto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
