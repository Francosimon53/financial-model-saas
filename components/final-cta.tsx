import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance mb-6">
            ¿Listo para modelar tu proyecto?
          </h2>
          <p className="text-lg lg:text-xl text-primary-foreground/90 leading-relaxed mb-8">
            Únete a los equipos financieros que ya confían en nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-base">
              Comenzar Gratis Ahora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              Agendar demo con un experto
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
