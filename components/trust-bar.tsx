import { Star } from "lucide-react"

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <p className="text-sm font-medium text-muted-foreground">Usado por equipos financieros en:</p>
          <div className="flex items-center gap-8 flex-wrap justify-center">
            <div className="h-8 px-4 flex items-center justify-center bg-background rounded border border-border">
              <span className="text-sm font-semibold text-muted-foreground">EMPRESA</span>
            </div>
            <div className="h-8 px-4 flex items-center justify-center bg-background rounded border border-border">
              <span className="text-sm font-semibold text-muted-foreground">GRUPO</span>
            </div>
            <div className="h-8 px-4 flex items-center justify-center bg-background rounded border border-border">
              <span className="text-sm font-semibold text-muted-foreground">INDUSTRIAS</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">200+ modelos creados</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">15+ industrias</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
