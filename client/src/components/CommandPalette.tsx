import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, FileText, DollarSign, Users, TrendingUp, Settings, Calculator } from "lucide-react";
import { useLocation } from "wouter";

interface CommandPaletteProps {
  projectId?: number;
}

export function CommandPalette({ projectId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    setLocation(path);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-0 shadow-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Buscar acciones, proyectos, módulos..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No se encontraron resultados.
            </Command.Empty>

            {projectId && (
              <Command.Group heading="Módulos del Proyecto">
                <Command.Item
                  onSelect={() => navigate(`/project/${projectId}/revenue`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Ingresos</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => navigate(`/project/${projectId}/cogs`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                >
                  <Calculator className="h-4 w-4" />
                  <span>COGS</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => navigate(`/project/${projectId}/salaries`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                >
                  <Users className="h-4 w-4" />
                  <span>Salarios</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => navigate(`/project/${projectId}/statements`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                >
                  <FileText className="h-4 w-4" />
                  <span>Estados Financieros</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => navigate(`/project/${projectId}/dashboard`)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Dashboard</span>
                </Command.Item>
              </Command.Group>
            )}

            <Command.Group heading="Navegación">
              <Command.Item
                onSelect={() => navigate("/projects")}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
              >
                <FileText className="h-4 w-4" />
                <span>Mis Proyectos</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/pricing")}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                <span>Planes y Precios</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Atajos">
              <Command.Item className="flex items-center justify-between px-2 py-1.5 text-sm opacity-50">
                <span>Abrir Command Palette</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
