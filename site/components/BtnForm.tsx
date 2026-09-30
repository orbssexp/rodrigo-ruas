"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useForm } from "./FormProvider"

interface BtnFormProps {
  children: string
  pacote?:  string
  tipo?:    string   /* gruposDoRuas | assinadoByRuas */
  className?: string
  variant?: "primary" | "outline" | "inverted"
  stagger?: number
}

/**
 * Botão que abre o FormModal.
 * Usa o mesmo visual do BtnPrimary com flip text.
 */
export function BtnForm({
  children,
  pacote,
  tipo,
  className = "",
  variant = "primary",
  stagger = 0.014,
}: BtnFormProps) {
  const { openForm } = useForm()
  const textRef = useRef<HTMLSpanElement>(null)

  const animate = (dir: 1 | -1) => {
    if (!textRef.current) return
    const inners = textRef.current.querySelectorAll<HTMLElement>(".bi")
    gsap.killTweensOf(inners)
    gsap.to(inners, {
      yPercent: dir === 1 ? -50 : 0,
      duration: 0.32,
      ease: "power3.inOut",
      stagger: { each: stagger },
    })
  }

  const LINE = 1.15
  const H    = `${LINE}em`

  const chars = [...children].map((char, i) => {
    const isSpace = char === " "
    return (
      <span key={i} style={{ display: "inline-block", overflow: "hidden", height: H, lineHeight: LINE, verticalAlign: "bottom", minWidth: isSpace ? "0.32em" : undefined, whiteSpace: "pre" }}>
        <span className="bi" style={{ display: "flex", flexDirection: "column", willChange: "transform", whiteSpace: "pre" }}>
          <span style={{ height: H, lineHeight: LINE, flexShrink: 0, whiteSpace: "pre" }}>{char === " " ? " " : char}</span>
          <span style={{ height: H, lineHeight: LINE, flexShrink: 0, whiteSpace: "pre" }} aria-hidden>{char === " " ? " " : char}</span>
        </span>
      </span>
    )
  })

  const variantCls =
    variant === "outline"   ? "bg-transparent text-foreground border-[1.5px] border-foreground hover:bg-foreground hover:text-background" :
    variant === "inverted"  ? "bg-primary-foreground text-primary hover:opacity-90" :
    "bg-primary text-primary-foreground hover:opacity-90"

  const dotColor =
    variant === "outline"  ? "bg-foreground" :
    variant === "inverted" ? "bg-primary" :
    "bg-primary-foreground"

  return (
    <button
      onClick={() => openForm(pacote, tipo)}
      onMouseEnter={() => animate(1)}
      onMouseLeave={() => animate(-1)}
      className={`inline-flex items-center gap-3 text-[20px] font-semibold
                  px-8 py-4 rounded-full transition-all duration-200
                  cursor-pointer ${variantCls} ${className}`}
    >
      <span ref={textRef} className="inline-flex items-end select-none">{chars}</span>
      <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${dotColor}`} />
    </button>
  )
}
