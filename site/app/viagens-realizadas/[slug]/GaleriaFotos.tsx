"use client"

/* Grade de fotos (alturas naturais, estilo mural) + visualizador em tela
   cheia. No visualizador: botões com texto, setas do teclado, Esc para
   fechar e arrastar para os lados no celular. */

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react/dist/ssr"

export type Foto = { key: string; thumb: string; full: string; w: number; h: number; legenda?: string }

export function GaleriaFotos({ fotos, titulo }: { fotos: Foto[]; titulo: string }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const toque = useRef<number | null>(null)
  const total = fotos.length

  const fechar  = useCallback(() => setAberta(null), [])
  const proxima = useCallback(() => setAberta((i) => (i === null ? i : (i + 1) % total)), [total])
  const voltar  = useCallback(() => setAberta((i) => (i === null ? i : (i - 1 + total) % total)), [total])

  useEffect(() => {
    if (aberta === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar()
      if (e.key === "ArrowRight") proxima()
      if (e.key === "ArrowLeft") voltar()
    }
    window.addEventListener("keydown", onKey)
    const overflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = overflow
    }
  }, [aberta, fechar, proxima, voltar])

  const atual = aberta !== null ? fotos[aberta] : null

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {fotos.map((f, i) => (
          <figure key={f.key} className="mb-4 break-inside-avoid">
            <button
              type="button" onClick={() => setAberta(i)}
              aria-label={`Ampliar foto ${i + 1} de ${total}${f.legenda ? `: ${f.legenda}` : ""}`}
              className="group block w-full relative overflow-hidden cursor-pointer"
              data-cursor-theme="dark" data-cursor="expand" data-cursor-label="AMPLIAR"
              style={{ aspectRatio: `${f.w} / ${f.h}` }}
            >
              <img
                src={f.thumb} alt={f.legenda ?? `${titulo} — foto ${i + 1}`} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </button>
            {f.legenda && <figcaption className="t-small mt-2">{f.legenda}</figcaption>}
          </figure>
        ))}
      </div>

      {atual && (
        <div
          role="dialog" aria-modal="true" aria-label={`Foto ${aberta! + 1} de ${total}`}
          data-lenis-prevent data-cursor-theme="dark"
          className="fixed inset-0 z-[100] bg-[#060F18]/95 text-white flex flex-col animate-in fade-in duration-300"
          onClick={fechar}
          onPointerDown={(e) => { if (e.pointerType !== "mouse") toque.current = e.clientX }}
          onPointerUp={(e) => {
            if (toque.current === null) return
            const dx = e.clientX - toque.current
            toque.current = null
            if (Math.abs(dx) > 50) (dx < 0 ? proxima : voltar)()
          }}
        >
          <div className="flex items-center justify-between px-[clamp(16px,4vw,48px)] py-5" onClick={(e) => e.stopPropagation()}>
            <p className="text-[20px] font-bold tabular-nums">
              {aberta! + 1}<span className="text-white/65"> / {total}</span>
            </p>
            <button
              type="button" onClick={fechar}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[18px] font-semibold hover:bg-white hover:text-[#060F18] transition-colors cursor-pointer"
            >
              <X size={20} weight="bold" /> Fechar
            </button>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center px-[clamp(16px,4vw,48px)]">
            <img
              key={atual.key} src={atual.full} alt={atual.legenda ?? `${titulo} — foto ${aberta! + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-300 select-none"
              draggable={false}
            />
          </div>

          <div className="flex items-center justify-between gap-4 px-[clamp(16px,4vw,48px)] py-5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button" onClick={voltar}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[18px] font-semibold hover:bg-white hover:text-[#060F18] transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} weight="bold" /> <span className="hidden sm:inline">Anterior</span>
            </button>
            <p className="text-[17px] text-white/85 text-center line-clamp-2">{atual.legenda ?? ""}</p>
            <button
              type="button" onClick={proxima}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[18px] font-semibold hover:bg-white hover:text-[#060F18] transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Próxima</span> <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
