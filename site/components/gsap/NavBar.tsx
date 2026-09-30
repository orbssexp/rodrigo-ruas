"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname } from "next/navigation"
import { TransitionLink } from "./TransitionLink"
import { useForm } from "@/components/FormProvider"
import { useSound } from "@/components/SoundProvider"
import { DestinosModal } from "@/components/DestinosModal"
import { MobileMenu } from "./MobileMenu"

gsap.registerPlugin(ScrollTrigger)

export function NavBar() {
  const navRef   = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const { openForm }        = useForm()
  const { enabled, toggle } = useSound()

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 }
    )

    const st = ScrollTrigger.create({
      start: "top -80px",
      onUpdate: (self) => {
        navRef.current?.classList.toggle("nav--scrolled", self.progress > 0)
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      <style>{`
        .nav--scrolled {
          background: rgba(250,250,248,0.95) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 hsl(36 16% 85%);
        }
        .nav-link {
          position: relative;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: hsl(209 57% 12%);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link[aria-current="page"]::after { width: 100%; }
        .nav-link[aria-current="page"] { color: hsl(209 57% 12%); }
      `}</style>

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                   bg-background px-[clamp(20px,5vw,64px)] h-20
                   transition-all duration-300"
      >
        {/* Logo */}
        <a href="/" className="flex flex-col leading-tight group">
          <span className="text-xl font-bold tracking-tight text-foreground">RR VIAGENS</span>
        </a>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          <li><DestinosModal /></li>
          {[
            { label: "Galeria", href: "/viagens-realizadas" },
            { label: "Sobre",  href: "/sobre"           },
            { label: "Contato", href: "/contato"        },
          ].map(({ label, href }) => {
            const hrefPath = href.split("?")[0]
            const isActive = pathname === hrefPath || pathname.startsWith(hrefPath + "/")
            return (
              <li key={label}>
                <TransitionLink
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link text-[20px] font-medium transition-colors duration-200
                              ${isActive ? "text-foreground" : "text-foreground-muted hover:text-foreground"}`}
                >
                  {label}
                </TransitionLink>
              </li>
            )
          })}
        </ul>

        {/* Som toggle + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggle}
            aria-label={enabled ? "Desativar som" : "Ativar som"}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       text-foreground-subtle hover:text-foreground transition-colors"
            title={enabled ? "Som ativado" : "Som desativado"}
          >
            {enabled ? (
              /* speaker on */
              <svg width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M80 168H32a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h48l72-40v160z"/>
                <path d="M192 104.4a32 32 0 0 1 0 47.2"/>
                <path d="M221.7 80a72 72 0 0 1 0 96"/>
              </svg>
            ) : (
              /* speaker off */
              <svg width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M80 168H32a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h48l72-40v160z"/>
                <line x1="224" y1="80" x2="160" y2="176"/>
                <line x1="160" y1="80" x2="224" y2="176"/>
              </svg>
            )}
          </button>

        <button
          onClick={() => openForm()}
          className="hidden md:inline-flex items-center gap-3
                     bg-primary text-primary-foreground
                     text-[20px] font-semibold
                     px-7 py-3.5 rounded-full
                     hover:opacity-90 transition-opacity cursor-pointer"
        >
          Falar no WhatsApp
          <span className="w-[7px] h-[7px] rounded-full bg-primary-foreground shrink-0" />
        </button>
        </div>

        {/* Mobile menu — visível apenas em mobile */}
        <MobileMenu />
      </nav>
    </>
  )
}
