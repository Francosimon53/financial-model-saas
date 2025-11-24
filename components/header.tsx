import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">FM</span>
              </div>
              <span className="text-lg font-semibold">FinModelo</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#funcionalidades"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Producto
              </a>
              <a
                href="#casos-uso"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Casos de Uso
              </a>
              <a
                href="#recursos"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Recursos
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Iniciar Sesión
            </Button>
            <Button className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all">
              Comenzar Gratis
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
