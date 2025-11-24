import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function Testimonial() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <Card className="max-w-4xl mx-auto border-2">
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Quote className="h-8 w-8 text-primary" />
              </div>
              <blockquote className="text-xl lg:text-2xl font-medium text-pretty leading-relaxed">
                "Antes tardábamos semanas en preparar un modelo financiero. Ahora lo hacemos en días, y con mucha más
                confianza en los resultados."
              </blockquote>
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-full bg-muted overflow-hidden">
                  <img src="/professional-business-person.png" alt="Testimonial" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold">María González</p>
                  <p className="text-sm text-muted-foreground">Directora Financiera, Grupo Industrial</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
