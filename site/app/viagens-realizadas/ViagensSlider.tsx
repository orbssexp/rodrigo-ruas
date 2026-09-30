"use client"

/* Slider em tela cheia das viagens realizadas (referência: saisei /project).
   Fundo com a capa escurecida + foto em destaque que sobe (swipe-up, mesmo
   gesto da cortina entre páginas) + nome grande. Navega por botões com texto,
   pelos traços embaixo, pelas setas do teclado e arrastando no celular. */

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Camera, CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr"
import { TransitionLink, BtnPrimary } from "@/components/gsap"
import { fotosLabel, type ViagemSlide } from "./lib"

const EASE = "cubic-bezier(.77,0,.18,1)"
const pad = (n: number) => String(n).padStart(2, "0")

export function ViagensSlider({ slides }: { slides: ViagemSlide[] }) {
  const total = slides.length
  const [ativo, setAtivo] = useState(0)
  const [anterior, setAnterior] = useState<number | null>(null)
  const [troca, setTroca] = useState(0)   /* remonta a foto ativa → animação sempre roda */
  const toque = useRef<number | null>(null)

  const atualRef = useRef(0)
  const ir = useCallback((i: number) => {
    const alvo = ((i % total) + total) % total
    if (alvo === atualRef.current) return
    setAnterior(atualRef.current)
    setAtivo(alvo)
    setTroca((t) => t + 1)
    atualRef.current = alvo
  }, [total])
  const proxima = useCallback(() => ir(atualRef.current + 1), [ir])
  const voltar  = useCallback(() => ir(atualRef.current - 1), [ir])

  /* pré-carrega as fotos para a troca não piscar */
  useEffect(() => {
    slides.forEach((sl) => { new Image().src = sl.card; new Image().src = sl.bg })
  }, [slides])

  /* setas do teclado */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") proxima()
      if (e.key === "ArrowLeft") voltar()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [proxima, voltar])

  const s = slides[ativo]
  if (!s) return null

  return (
    <section
      data-cursor-theme="dark"
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#060F18] text-white select-none"
      onPointerDown={(e) => { if (e.pointerType !== "mouse") toque.current = e.clientX }}
      onPointerUp={(e) => {
        if (toque.current === null) return
        const dx = e.clientX - toque.current
        toque.current = null
        if (Math.abs(dx) > 50) (dx < 0 ? proxima : voltar)()
      }}
    >
      {/* ── fundo: capas empilhadas, a ativa aparece ─────────── */}
      {slides.map((sl, i) => (
        <div
          key={sl.id}
          aria-hidden
          className="absolute inset-0 motion-reduce:!transition-none"
          style={{
            opacity: i === ativo ? 1 : 0,
            transform: i === ativo ? "scale(1)" : "scale(1.08)",
            transition: `opacity 1.1s ease, transform 1.6s ${EASE}`,
          }}
        >
          <img src={sl.bg} alt="" className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-[#060F18]/70" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#060F18]/90 via-transparent to-[#060F18]/40" />

      <div className="relative z-10 h-full wrap flex flex-col pt-28 pb-8 md:pb-10">

        {/* ── topo: título da página + contador ───────────────── */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="t-label !text-white/75 mb-2">Galeria</p>
            <h1 className="t-h2 text-white">Viagens realizadas</h1>
          </div>
          <p className="font-bold tabular-nums leading-none text-[clamp(28px,4vw,48px)]" aria-live="polite">
            {pad(ativo + 1)}<span className="text-white/65"> / {pad(total)}</span>
          </p>
        </div>

        {/* ── centro: foto em destaque + nome ──────────────────── */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center py-6">
          <TransitionLink
            href={`/viagens-realizadas/${s.slug}`}
            className="group relative block md:col-span-5 lg:col-span-4 lg:col-start-2 w-full max-w-[300px] md:max-w-[440px] mx-auto md:mx-0 aspect-[4/5] overflow-hidden"
          >
            <style>{`@keyframes rr-foto-sobe { from { clip-path: inset(100% 0 0 0) } to { clip-path: inset(0 0 0 0) } }`}</style>
            {anterior !== null && slides[anterior] && (
              <div aria-hidden className="absolute inset-0 z-[1]">
                <img src={slides[anterior].card} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            <div
              key={troca}
              className="absolute inset-0 z-[2] overflow-hidden motion-reduce:!animate-none"
              style={{ animation: troca ? `rr-foto-sobe .9s ${EASE} both` : undefined }}
            >
              <img
                src={s.card} alt={`Foto da viagem: ${s.titulo}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>
            <span className="sr-only">Ver fotos de {s.titulo}</span>
          </TransitionLink>

          {/* key força reentrada da animação a cada troca */}
          <div key={s.id} className="md:col-span-7 lg:col-span-6 lg:col-start-7 text-center md:text-left animate-in fade-in slide-in-from-bottom-6 duration-700 motion-reduce:animate-none">
            <h2 className="font-bold uppercase leading-[0.95] text-white text-[clamp(40px,6.5vw,104px)] mb-5 break-words">{s.titulo}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[18px] md:text-[20px] text-white/85 mb-8">
              {s.local && <span className="flex items-center gap-2"><MapPin weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" />{s.local}</span>}
              {s.quando && <span className="flex items-center gap-2"><CalendarBlank weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" />{s.quando}</span>}
              {s.totalFotos > 0 && <span className="flex items-center gap-2"><Camera weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" />{fotosLabel(s.totalFotos)}</span>}
            </div>
            <TransitionLink href={`/viagens-realizadas/${s.slug}`}>
              <BtnPrimary className="!bg-primary-foreground !text-primary">Ver fotos da viagem</BtnPrimary>
            </TransitionLink>
          </div>
        </div>

        {/* ── rodapé: anterior / traços / próxima ──────────────── */}
        {total > 1 && (
          <div className="flex items-center justify-between gap-4">
            <button
              type="button" onClick={voltar}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[18px] font-semibold hover:bg-white hover:text-[#060F18] transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} weight="bold" /> <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center gap-2 overflow-hidden">
              {slides.map((sl, i) => (
                <button
                  key={sl.id} type="button" onClick={() => ir(i)}
                  aria-label={`Ir para ${sl.titulo}`} aria-current={i === ativo}
                  className="h-11 flex items-center cursor-pointer"
                >
                  <span
                    className="block h-[3px] rounded-full transition-all duration-500"
                    style={{ width: i === ativo ? 44 : 18, background: i === ativo ? "#fff" : "rgba(255,255,255,.4)" }}
                  />
                </button>
              ))}
            </div>

            <button
              type="button" onClick={proxima}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[18px] font-semibold hover:bg-white hover:text-[#060F18] transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Próxima</span> <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
