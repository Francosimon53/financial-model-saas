import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ArrowRight, BarChart3, Calculator, DollarSign, FileSpreadsheet, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation("/projects");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {APP_TITLE}
            </h1>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Iniciar Sesión</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Modela el Futuro Financiero de tu Proyecto Industrial
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Crea, analiza y optimiza modelos financieros complejos sin ser experto. 
            Diseñado para refinerías, plantas químicas, energías renovables y más.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <a href={getLoginUrl()}>
                Comenzar Gratis <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Funcionalidades Completas</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Gestión de Ingresos</CardTitle>
              <CardDescription>
                Configure tipos de productos, precios, volúmenes y estacionalidad para proyecciones precisas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-500 transition-colors">
            <CardHeader>
              <Calculator className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Costos y Gastos</CardTitle>
              <CardDescription>
                Modele COGS, salarios, OPEX, gastos fijos y CAPEX con crecimiento anual automático.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Personal y Salarios</CardTitle>
              <CardDescription>
                Catálogo completo de posiciones con fechas de inicio/fin y cálculo automático de nómina.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <FileSpreadsheet className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Estados Financieros</CardTitle>
              <CardDescription>
                Income Statement y Cash Flow generados automáticamente a partir de sus supuestos.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-orange-500 transition-colors">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Dashboards Interactivos</CardTitle>
              <CardDescription>
                Visualice KPIs clave: EBITDA, ROI, break-even y gráficos comparativos en tiempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-red-500 transition-colors">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Fuentes y Usos</CardTitle>
              <CardDescription>
                Modele estructura de capital, deuda y equity con análisis de apalancamiento.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl my-16">
        <h3 className="text-3xl font-bold text-center mb-12">Planes Flexibles</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-gray-500">/mes</span></div>
              <CardDescription>Perfecto para empezar</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 1 proyecto activo</li>
                <li>✓ Todos los módulos financieros</li>
                <li>✓ Exportación a PDF</li>
                <li>✓ Soporte por email</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <a href={getLoginUrl()}>Comenzar</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-4 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Popular
            </div>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <div className="text-3xl font-bold">$49<span className="text-lg font-normal text-gray-500">/mes</span></div>
              <CardDescription>Para profesionales</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 10 proyectos activos</li>
                <li>✓ Todos los módulos financieros</li>
                <li>✓ Exportación a PDF y Excel</li>
                <li>✓ Versionado de proyectos</li>
                <li>✓ Soporte prioritario</li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <a href={getLoginUrl()}>Comenzar</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="text-3xl font-bold">$199<span className="text-lg font-normal text-gray-500">/mes</span></div>
              <CardDescription>Para equipos grandes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Proyectos ilimitados</li>
                <li>✓ Todos los módulos financieros</li>
                <li>✓ Exportación avanzada</li>
                <li>✓ Colaboración en equipo</li>
                <li>✓ Consultoría incluida</li>
                <li>✓ Soporte 24/7</li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <a href={getLoginUrl()}>Contactar</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">¿Listo para transformar tu planificación financiera?</h3>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de profesionales que ya confían en FinModel Pro
          </p>
          <Button size="lg" variant="secondary" className="text-lg" asChild>
            <a href={getLoginUrl()}>
              Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 {APP_TITLE}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
