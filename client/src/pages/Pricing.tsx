import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Para empezar con modelado financiero básico",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "1 proyecto activo",
      "Todos los módulos de entrada de datos",
      "Estados financieros básicos",
      "Dashboard con KPIs",
      "Exportación a PDF",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para profesionales y consultores financieros",
    priceMonthly: 49,
    priceYearly: 470.40,
    features: [
      "10 proyectos activos",
      "Todos los módulos avanzados",
      "Estados financieros completos",
      "Dashboard con gráficos interactivos",
      "Exportación a PDF y Excel",
      "Plantillas por industria",
      "Versionado de proyectos",
      "Comparación de escenarios",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para equipos y organizaciones grandes",
    priceMonthly: 149,
    priceYearly: 1428,
    features: [
      "Proyectos ilimitados",
      "Usuarios ilimitados",
      "Todos los módulos premium",
      "API de integración",
      "Exportación avanzada",
      "Plantillas personalizadas",
      "Soporte prioritario 24/7",
      "Capacitación personalizada",
      "SLA garantizado",
    ],
  },
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { isAuthenticated, user } = useAuth();
  const createCheckout = trpc.subscription.createCheckout.useMutation();

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (planId === "free") {
      toast.info("Ya estás en el plan gratuito");
      return;
    }

    try {
      const result = await createCheckout.mutateAsync({
        plan: planId as "professional" | "enterprise",
        billingPeriod,
      });

      if (result.url) {
        window.open(result.url, "_blank");
        toast.success("Redirigiendo a la página de pago...");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear la sesión de pago");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Elige el plan perfecto para tus necesidades de modelado financiero
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("monthly")}
            >
              Mensual
            </Button>
            <Button
              variant={billingPeriod === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingPeriod("yearly")}
            >
              Anual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Ahorra 20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Más Popular
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-4xl font-bold">
                  {plan.id === "free" ? (
                    "Gratis"
                  ) : (
                    <>
                      $
                      {billingPeriod === "monthly"
                        ? plan.priceMonthly
                        : (plan.priceYearly / 12).toFixed(2)}
                      <span className="text-lg font-normal text-muted-foreground">
                        /mes
                      </span>
                    </>
                  )}
                </div>

                {plan.id !== "free" && billingPeriod === "yearly" && (
                  <p className="text-sm text-muted-foreground">
                    Facturado anualmente (${plan.priceYearly}/año)
                  </p>
                )}

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={
                    createCheckout.isPending ||
                    (user?.subscriptionPlan === plan.id && plan.id !== "free")
                  }
                >
                  {user?.subscriptionPlan === plan.id && plan.id !== "free"
                    ? "Plan Actual"
                    : plan.id === "free"
                    ? "Comenzar Gratis"
                    : "Suscribirse"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Todos los planes incluyen actualizaciones gratuitas y soporte por email.</p>
          <p className="mt-2">
            ¿Necesitas un plan personalizado?{" "}
            <a href="mailto:support@finmodelpro.com" className="text-primary hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
