"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function AppleHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border/40 shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
          FinModel
        </a>

        {/* Navigation links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#specs" className="text-foreground/70 hover:text-foreground transition-colors">
            Specs
          </a>
          <a href="#testimonial" className="text-foreground/70 hover:text-foreground transition-colors">
            Testimonios
          </a>
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Probar gratis
        </Button>
      </nav>
    </header>
  )
}
