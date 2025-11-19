import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "¡Bienvenido a FinModel Pro!",
    description: "Te guiaremos a través de las funcionalidades principales para que puedas comenzar a modelar tus proyectos financieros rápidamente.",
  },
  {
    title: "Crea tu Primer Proyecto",
    description: "Comienza seleccionando una plantilla de industria o crea un proyecto en blanco. Las plantillas incluyen datos precargados para ayudarte a empezar.",
  },
  {
    title: "Módulos Financieros",
    description: "Accede a todos los módulos desde el menú lateral: Ingresos, COGS, Salarios, OPEX, CAPEX, y más. Cada módulo te permite ingresar datos específicos.",
  },
  {
    title: "Estados Financieros Automáticos",
    description: "Los Income Statement y Cash Flow se generan automáticamente basándose en los datos que ingreses en cada módulo.",
  },
  {
    title: "Dashboard y KPIs",
    description: "Visualiza métricas clave como EBITDA, ROI y break-even en el dashboard con gráficos interactivos.",
  },
  {
    title: "Command Palette (⌘K)",
    description: "Presiona Cmd+K (o Ctrl+K en Windows) en cualquier momento para acceder rápidamente a cualquier módulo o función.",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (hasCompletedOnboarding) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription className="mt-2">{step.description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep < onboardingSteps.length - 1 ? (
                  <>
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Comenzar"
                )}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Paso {currentStep + 1} de {onboardingSteps.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
