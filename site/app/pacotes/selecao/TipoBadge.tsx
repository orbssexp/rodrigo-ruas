"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { Info } from "@phosphor-icons/react"

const TIPO_CONFIG: Record<string, { label: string; bg: string; text: string; desc: string }> = {
  gruposDoRuas: {
    label: "Grupo Ruas",
    bg:    "#FFF9E6",
    text:  "#7A5100",
    desc:  "Rodrigo vai junto. Roteiro exclusivo com curadoria e presença pessoal dele do início ao fim.",
  },
  assinadoByRuas: {
    label: "Assinado By Ruas",
    bg:    "#E8F4FF",
    text:  "#0A3D5C",
    desc:  "Curadoria feita por Rodrigo — hotéis, roteiro e experiências — mas ele não vai junto. Privativo, sai quando você quiser.",
  },
}

export function TipoBadge({ tipo }: { tipo: string }) {
  const config = TIPO_CONFIG[tipo]
  const tipRef = useRef<HTMLSpanElement>(null)
  if (!config) return null

  const show = () => {
    if (!tipRef.current) return
    gsap.killTweensOf(tipRef.current)
    gsap.fromTo(tipRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
    )
  }
  const hide = () => {
    if (!tipRef.current) return
    gsap.killTweensOf(tipRef.current)
    gsap.to(tipRef.current, { opacity: 0, y: 6, duration: 0.15, ease: "power2.in" })
  }

  return (
    <span className="relative inline-flex items-center gap-1.5 shrink-0 self-center"
          onMouseEnter={show} onMouseLeave={hide}>
      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide
                       px-3 py-1.5 rounded-full cursor-default select-none"
            style={{ background: config.bg, color: config.text }}>
        {config.label}
        <Info size={14} weight="fill" style={{ opacity: 0.6 }} />
      </span>
      <span ref={tipRef}
            className="absolute left-0 bottom-full mb-2 z-50 w-72 rounded-xl shadow-2xl px-5 py-4
                       text-[17px] leading-snug font-medium"
            style={{ background: config.bg, color: config.text, opacity: 0, pointerEvents: "none" }}>
        {config.desc}
        <span className="absolute left-4 top-full w-0 h-0"
              style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                       borderTop: `6px solid ${config.bg}` }} />
      </span>
    </span>
  )
}
