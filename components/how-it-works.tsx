import { FileEdit, Cpu, Download } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: FileEdit,
    title: "Define tu proyecto",
    description: "5 minutos",
  },
  {
    number: "02",
    icon: Cpu,
    title: "El sistema calcula automáticamente",
    description: "Instantáneo",
  },
  {
    number: "03",
    icon: Download,
    title: "Descarga reportes o comparte online",
    description: "En segundos",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-balance mb-4">Cómo funciona</h2>
          <p className="text-lg text-muted-foreground">Tres simples pasos para tu modelo financiero profesional</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                      <Icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
