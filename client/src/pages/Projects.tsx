import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { TemplateSelector } from "@/components/TemplateSelector";
import { OnboardingTour } from "@/components/OnboardingTour";
import { CommandPalette } from "@/components/CommandPalette";
import { EmptyState } from "@/components/EmptyState";
import { FolderOpen } from "lucide-react";

export default function Projects() {
  const [, setLocation] = useLocation();
  const { data: projects, isLoading } = trpc.projects.list.useQuery();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding && projects && projects.length === 0) {
      setShowOnboarding(true);
    }
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <CommandPalette />
      
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}

      <TemplateSelector
        open={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
      />

      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mis Proyectos</h1>
            <p className="text-muted-foreground mt-2">Gestiona tus modelos financieros</p>
          </div>
          <Button onClick={() => setShowTemplateSelector(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        </div>

        {projects && projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No tienes proyectos aún"
            description="Crea tu primer modelo financiero para comenzar. Puedes elegir una plantilla de industria o empezar desde cero."
            actionLabel="Crear Proyecto"
            onAction={() => setShowTemplateSelector(true)}
            helpText="¿Necesitas ayuda para empezar?"
            helpLink="https://docs.finmodelpro.com/getting-started"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
                onClick={() => setLocation(`/project/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    {project.industry || "Sin industria especificada"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description || "Sin descripción"}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Inicio: {new Date(project.startDate).toLocaleDateString()}</div>
                    <div>Fin: {new Date(project.endDate).toLocaleDateString()}</div>
                    <div className="text-xs text-primary mt-2">
                      Duración: {Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
