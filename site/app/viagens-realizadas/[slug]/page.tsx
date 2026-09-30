export const revalidate = 60

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CalendarBlank, Camera, MapPin } from "@phosphor-icons/react/dist/ssr"
import { NavBar, MagneticCursor, LineReveal, ScrollReveal, RevealImage, TransitionLink } from "@/components/gsap"
import { ImageOverlay } from "@/components/ImageOverlay"
import { BtnForm } from "@/components/BtnForm"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { VIAGEM_REALIZADA_BY_SLUG_QUERY, VIAGENS_SLUGS_QUERY } from "@/sanity/lib/queries"
import { fotosLabel, mesAno, toSlide, type ViagemRaw } from "../lib"
import { GaleriaFotos, type Foto } from "./GaleriaFotos"

/* eslint-disable @typescript-eslint/no-explicit-any */
type ViagemData = ViagemRaw & {
  resumo?: string
  fotos?: { _key: string; legenda?: string; dim?: { width: number; height: number } }[]
  outras?: ViagemRaw[]
}

async function buscar(slug: string): Promise<ViagemData | null> {
  try { return await client.fetch(VIAGEM_REALIZADA_BY_SLUG_QUERY, { slug }) } catch { return null }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const v = await buscar(slug)
  if (!v) return {}
  return {
    title: `${v.titulo} — Viagens realizadas — RR Viagens`,
    description: v.resumo ?? `Fotos da viagem ${v.titulo}${v.local ? ` (${v.local})` : ""} com a RR Viagens.`,
  }
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "placeholder") return []
  try {
    const list: { slug: string }[] = await client.fetch(VIAGENS_SLUGS_QUERY)
    return list.map((v) => ({ slug: v.slug }))
  } catch { return [] }
}

export default async function ViagemRealizadaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const viagem = await buscar(slug)
  if (!viagem) notFound()

  const quando = mesAno(viagem.data)
  const fotos: Foto[] = (viagem.fotos ?? [])
    .filter((f: any) => f?.asset)
    .map((f: any) => ({
      key: f._key,
      legenda: f.legenda,
      w: f.dim?.width ?? 4,
      h: f.dim?.height ?? 3,
      thumb: urlFor(f).width(900).url(),
      full:  urlFor(f).width(2200).fit("max").url(),
    }))
  const outras = (viagem.outras ?? []).map(toSlide)

  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip">
      <MagneticCursor />
      <NavBar />

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-[88svh] flex items-end overflow-hidden" data-cursor-theme="dark">
        <div className="absolute inset-0">
          {viagem.capa && (
            <img src={urlFor(viagem.capa).width(1920).height(1080).fit("crop").url()} alt={viagem.titulo} className="w-full h-full object-cover" />
          )}
        </div>
        <ImageOverlay blur={14} darkFrom={0.88} darkMid={0.25} blurStop="35%" blurFade="65%" />
        <div className="relative z-10 wrap pb-16 w-full">
          <p className="t-label !text-white mb-4">Viagem realizada</p>
          <LineReveal as="h1" className="t-hero text-white leading-none mb-6">
            {viagem.titulo.toUpperCase()}
          </LineReveal>
          <div className="flex flex-wrap gap-6 text-white/85 text-[18px]">
            {viagem.local && <span className="flex items-center gap-2"><MapPin weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {viagem.local}</span>}
            {quando && <span className="flex items-center gap-2"><CalendarBlank weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {quando}</span>}
            {fotos.length > 0 && <span className="flex items-center gap-2"><Camera weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {fotosLabel(fotos.length)}</span>}
          </div>
        </div>
      </section>

      {/* ══ RESUMO ═════════════════════════════════════════ */}
      {viagem.resumo && (
        <section className="py-20">
          <div className="wrap" style={{ maxWidth: 860, marginLeft: "auto", marginRight: "auto" }}>
            <ScrollReveal>
              <p className="t-label mb-6">Como foi</p>
              <p className="text-[clamp(22px,2.4vw,30px)] leading-[1.45] text-foreground whitespace-pre-line">{viagem.resumo}</p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ══ FOTOS ══════════════════════════════════════════ */}
      <section className={viagem.resumo ? "py-20 border-t border-border" : "py-20"}>
        <div className="wrap">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="t-label mb-2">Galeria</p>
              <h2 className="t-h2 text-foreground">Fotos da viagem</h2>
            </div>
            {fotos.length > 0 && <p className="t-body md:text-right">Clique em uma foto para ver em tela cheia.</p>}
          </ScrollReveal>
          {fotos.length > 0
            ? <GaleriaFotos fotos={fotos} titulo={viagem.titulo} />
            : <p className="t-body-lg">As fotos desta viagem vão aparecer aqui em breve.</p>}
        </div>
      </section>

      {/* ══ OUTRAS VIAGENS ═════════════════════════════════ */}
      {outras.length > 0 && (
        <section className="py-20 border-t-2 border-foreground bg-background-section">
          <div className="wrap">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="t-label mb-2">Continue explorando</p>
                <h2 className="t-h2 text-foreground">Outras viagens</h2>
              </div>
              <TransitionLink href="/viagens-realizadas" className="t-body underline underline-offset-4 hover:text-foreground transition-colors">
                Ver todas as viagens
              </TransitionLink>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {outras.map((v, i) => (
                <TransitionLink key={v.id} href={`/viagens-realizadas/${v.slug}`} className="group block">
                  <RevealImage direction="up" delay={i * 0.06} className="overflow-hidden" data-cursor-theme="dark" data-cursor="expand" data-cursor-label="VER FOTOS">
                    <div className="aspect-[3/2] relative overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
                        <img src={v.thumb} alt={v.titulo} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </div>
                  </RevealImage>
                  <h3 className="text-[22px] font-bold uppercase text-foreground mt-4">{v.titulo}</h3>
                  <p className="t-body">{[v.local, v.quando].filter(Boolean).join(" · ")}</p>
                </TransitionLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ════════════════════════════════════════════ */}
      <section className="bg-foreground py-20" data-cursor-theme="dark">
        <div className="wrap flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="t-label !text-primary-foreground/75 mb-3">Próxima viagem</p>
            <h2 className="t-h2 text-primary-foreground max-w-2xl">Quer viver uma viagem assim?</h2>
          </div>
          <BtnForm variant="inverted" pacote={viagem.titulo}>Falar com o Rodrigo</BtnForm>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="wrap flex justify-between items-center">
          <p className="font-bold tracking-tight text-foreground">RR VIAGENS</p>
          <TransitionLink href="/viagens-realizadas" className="t-small text-foreground-subtle hover:text-foreground transition-colors">
            ← Voltar para a galeria
          </TransitionLink>
        </div>
      </footer>
    </main>
  )
}
