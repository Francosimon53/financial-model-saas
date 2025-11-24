export function Footer() {
  const footerLinks = {
    producto: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Precios", href: "#" },
      { label: "Casos de uso", href: "#casos-uso" },
      { label: "Actualizaciones", href: "#" },
    ],
    recursos: [
      { label: "Documentación", href: "#" },
      { label: "Guías", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Soporte", href: "#" },
    ],
    empresa: [
      { label: "Acerca de", href: "#" },
      { label: "Equipo", href: "#" },
      { label: "Contacto", href: "#" },
      { label: "Carreras", href: "#" },
    ],
    legal: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Seguridad", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div>
            <h3 className="font-semibold mb-4">Producto</h3>
            <ul className="space-y-3">
              {footerLinks.producto.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">FM</span>
            </div>
            <span className="font-semibold">FinModelo</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 FinModelo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
