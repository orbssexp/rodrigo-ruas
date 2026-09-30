"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import { TransitionLink } from "./TransitionLink"
import { useForm } from "@/components/FormProvider"

const LINKS = [
  { label: "Destinos",  href: "/pacotes/selecao" },
  { label: "Galeria",   href: "/viagens-realizadas" },
  { label: "Sobre",     href: "/sobre"            },
  { label: "Contato",   href: "/contato"          },
]

export function MobileMenu() {
  const [open, setOpen]   = useState(false)
  const [mounted, setMounted] = useState(false)
  const overlayRef        = useRef<HTMLDivElement>(null)
  const linksRef          = useRef<HTMLUListElement>(null)
  const footerRef         = useRef<HTMLDivElement>(null)
  const pathname          = usePathname()
  const { openForm }      = useForm()

  /* hidrata no client */
  useEffect(() => setMounted(true), [])

  /* fecha ao mudar de página */
  useEffect(() => { setOpen(false) }, [pathname])

  /* animação GSAP */
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    if (open) {
      document.body.style.overflow = "hidden"
      gsap.set(overlay, { display: "flex" })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
      const linkEls = linksRef.current ? Array.from(linksRef.current.children) : []
      gsap.fromTo(linkEls,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07, delay: 0.1 }
      )
      if (footerRef.current)
        gsap.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.45 })
    } else {
      document.body.style.overflow = ""
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      })
    }
  }, [open])

  const overlay = (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col"
      style={{
        display:    "none",
        opacity:    0,
        zIndex:     99999,
        background: "#080F18",
        padding:    "clamp(20px,5vw,32px)",
      }}
    >
      {/* Topo */}
      <div className="flex items-center justify-between shrink-0">
        <a href="/" onClick={() => setOpen(false)}
           className="text-[18px] font-bold tracking-tight text-white">
          RR VIAGENS
        </a>
        <button
          onClick={() => setOpen(false)}
          className="text-[15px] font-semibold uppercase tracking-[0.14em] text-white/60
                     hover:text-white transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>

      {/* Links grandes — ocupa a parte central/inferior */}
      <ul ref={linksRef} className="flex flex-col justify-end flex-1 gap-3 pb-6">
        {LINKS.map(({ label, href }) => (
          <li key={label}>
            <TransitionLink
              href={href}
              onClick={() => setOpen(false)}
              className="block text-white font-black uppercase leading-none tracking-tight
                         hover:text-white/40 transition-colors duration-200"
              style={{ fontSize: "48px", letterSpacing: "-0.02em" }}
            >
              {label}
            </TransitionLink>
          </li>
        ))}
      </ul>

      {/* Rodapé */}
      <div ref={footerRef}
           className="shrink-0 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <a href="https://instagram.com/rodrigoruas"
             className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/40
                        hover:text-white transition-colors">
            Instagram
          </a>
          <a href="https://wa.me/5511966401489" target="_blank" rel="noreferrer"
             className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/40
                        hover:text-white transition-colors">
            WhatsApp
          </a>
        </div>
        <p className="text-[12px] text-white/20">© 2026 RR Viagens</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Botão MENU — só mobile */}
      <div className="flex md:hidden items-center gap-3">
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground
                     text-[15px] font-semibold px-5 py-2.5 rounded-full cursor-pointer"
        >
          Contato
          <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground shrink-0" />
        </button>
        <button
          onClick={() => setOpen(true)}
          className="text-[15px] font-semibold uppercase tracking-[0.12em] text-foreground cursor-pointer"
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {/* Portal — renderiza direto no body, fora do nav */}
      {mounted && createPortal(overlay, document.body)}
    </>
  )
}
