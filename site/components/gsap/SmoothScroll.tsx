"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  /* Não roda o smooth-scroll dentro do Sanity Studio (/admin) — o Lenis
     sequestra o wheel e quebra o scroll interno do Studio. */
  const isStudio = pathname?.startsWith("/admin") ?? false

  useEffect(() => {
    if (isStudio) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Conecta Lenis ao GSAP ticker para que ScrollTrigger funcione
    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isStudio])

  /**
   * O Lenis é criado uma única vez e persiste entre navegações client-side.
   * Ao trocar de rota, ele mantém o `limit` (altura rolável) da página anterior
   * até o ResizeObserver do autoResize disparar — o que leva ~1s. Nessa janela,
   * se a nova página é mais alta, a roda do mouse trava antes do fim real
   * (só a scrollbar nativa alcança o final). Recalculamos as dimensões
   * explicitamente a cada troca de rota para fechar essa janela.
   */
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    let raf = 0
    const resync = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    // após o commit do novo conteúdo + um frame de layout
    raf = requestAnimationFrame(resync)
    // segunda passada para conteúdo que assenta um pouco depois (curtain, imagens)
    const t = setTimeout(resync, 350)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [pathname])

  return <>{children}</>
}
