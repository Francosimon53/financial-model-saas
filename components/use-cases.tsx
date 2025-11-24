import { Factory, Zap, Droplet, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const useCases = [
  {
    icon: Factory,
    title: "Plantas industriales",
  },
  {
    icon: Zap,
    title: "Energías renovables",
  },
  {
    icon: Droplet,
    title: "Refinerías",
  },
  {
    icon: Building2,
    title: "Infraestructura",
  },
]

export function UseCases() {
  return (
    <section id="casos-uso" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance mb-4">
            Para cada tipo de proyecto industrial
          </h2>
          <p className="text-lg text-muted-foreground">Modelos especializados para diferentes sectores</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{useCase.title}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
