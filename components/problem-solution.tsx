import { X, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ProblemSolution() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance mb-4">Del caos a la claridad</h2>
          <p className="text-lg text-muted-foreground">
            Transformamos la complejidad del modelado financiero en un proceso simple y profesional
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Antes</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Fórmulas rotas en Excel</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Versiones perdidas</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Meses de trabajo manual</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Ahora</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Modelos estandarizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Historial completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Listo en días</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
