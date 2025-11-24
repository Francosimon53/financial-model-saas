import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign, Calculator, Users, TrendingDown, Wrench,
  Building2, PiggyBank, FileText, BarChart3, ArrowLeft, Brain
} from "lucide-react";
import { useLocation } from "wouter";

export default function ProjectDetail({ projectId }: { projectId: number }) {
  const [, setLocation] = useLocation();
  const { data: project, isLoading } = trpc.projects.get.useQuery({ id: projectId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Proyecto no encontrado</h1>
        <Button onClick={() => setLocation("/projects")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Proyectos
        </Button>
      </div>
    );
  }

  const modules = [
    {
      title: "Ingresos",
      description: "Gestión de productos y proyecciones de ventas",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      path: `/project/${projectId}/revenue`
    },
    {
      title: "COGS",
      description: "Costos directos y materia prima",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      path: `/project/${projectId}/cogs`
    },
    {
      title: "Salarios",
      description: "Personal y costos de nómina",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: `/project/${projectId}/salaries`
    },
    {
      title: "OPEX",
      description: "Gastos operativos variables",
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      path: `/project/${projectId}/opex`
    },
    {
      title: "Gastos Fijos",
      description: "Mantenimientos y turnarounds",
      icon: Wrench,
      color: "text-red-600",
      bgColor: "bg-red-50",
      path: `/project/${projectId}/fixed-expenses`
    },
    {
      title: "CAPEX",
      description: "Inversiones de capital",
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      path: `/project/${projectId}/capex`
    },
    {
      title: "Financiamiento",
      description: "Fuentes de capital y deuda",
      icon: PiggyBank,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      path: `/project/${projectId}/funding`
    },
    {
      title: "Estados Financieros",
      description: "Income Statement y Cash Flow",
      icon: FileText,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      path: `/project/${projectId}/statements`
    },
    {
      title: "Dashboard",
      description: "KPIs y visualizaciones",
      icon: BarChart3,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      path: `/project/${projectId}/dashboard`
    },
    {
      title: "Análisis con IA",
      description: "Insights y recomendaciones inteligentes",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      path: `/project/${projectId}/ai-analysis`
    }
  ];

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => setLocation("/projects")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Proyectos
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 text-lg">{project.description || "Sin descripción"}</p>
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <div>
            <span className="font-semibold">Industria:</span> {project.industry || "No especificada"}
          </div>
          <div>
            <span className="font-semibold">Período:</span>{" "}
            {new Date(project.startDate).toLocaleDateString()} -{" "}
            {new Date(project.endDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Moneda:</span> {project.currency}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Módulos del Proyecto</h2>
        <p className="text-gray-600 mb-6">
          Seleccione un módulo para gestionar los datos de su modelo financiero
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.path}
              className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => setLocation(module.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Abrir Módulo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle>Guía Rápida</CardTitle>
          <CardDescription>Pasos recomendados para completar su modelo financiero</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">1.</span>
              <span>Configure sus productos y proyecciones de <strong>Ingresos</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">2.</span>
              <span>Defina los <strong>COGS</strong> (costos directos) asociados a la producción</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">3.</span>
              <span>Agregue el personal y <strong>Salarios</strong> del proyecto</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">4.</span>
              <span>Configure <strong>OPEX</strong> y <strong>Gastos Fijos</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">5.</span>
              <span>Planifique las inversiones de <strong>CAPEX</strong></span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">6.</span>
              <span>Defina la estructura de <strong>Financiamiento</strong> (equity y deuda)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">7.</span>
              <span>Revise los <strong>Estados Financieros</strong> generados automáticamente</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">8.</span>
              <span>Analice los KPIs y métricas en el <strong>Dashboard</strong></span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
