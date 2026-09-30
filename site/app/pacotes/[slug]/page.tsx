export const revalidate = 60

import { ImageOverlay } from "@/components/ImageOverlay"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { PACOTE_BY_SLUG_QUERY, PACOTES_SLUGS_QUERY } from "@/sanity/lib/queries"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import {
  NavBar, ScrollReveal, LineReveal,
  RevealImage, BtnPrimary, MagneticCursor, ImagePlaceholder,
  TransitionLink,
} from "@/components/gsap"
import { Clock, Airplane, Users, MapPin, Star, Check, X } from "@phosphor-icons/react/dist/ssr"
import { BtnForm } from "@/components/BtnForm"
import { StatusBadge } from "@/components/StatusBadge"
import { PricingTicket } from "@/components/PricingTicket"
import { RoteiroDias, type Dia } from "@/components/RoteiroDias"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PacoteData {
  _id: string; titulo: string; slug: string; badge?: string; heroImage?: any
  tipo?: string; periodo?: string; dias?: number; partida?: string; vagas?: number
  moeda?: string; entrada?: number; numParcelas?: number; valorParcela?: number
  aeroportoPartida?: string; aeroportoDestino?: string; dataIda?: string; dataVolta?: string
  politicaCancelamento?: string; politicaReagendamento?: string
  seguroValor?: string; seguroStatus?: string; tagline?: string
  rodapeAtendimento?: string; rodapeSeguranca?: string
  intro?: any[]; pullQuote?: string; itinerario?: Dia[]
  galeria?: any[]; incluso?: string[]; naoIncluso?: string[]; metaDescricao?: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const p: PacoteData | null = await client.fetch(PACOTE_BY_SLUG_QUERY, { slug })
    if (!p) return {}
    return { title: `${p.titulo} — RR Viagens`, description: p.metaDescricao ?? `Pacote ${p.titulo} com Rodrigo Ruas.` }
  } catch { return {} }
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === "placeholder") return []
  try {
    const list: { slug: string }[] = await client.fetch(PACOTES_SLUGS_QUERY)
    return list.map(p => ({ slug: p.slug }))
  } catch { return [] }
}

const ptComponents: PortableTextComponents = {
  block: {
    normal:     ({ children }) => <p className="t-body-lg text-foreground-muted mb-5 leading-relaxed">{children}</p>,
    h2:         ({ children }) => <h2 className="t-h2 text-foreground mt-12 mb-4">{children}</h2>,
    h3:         ({ children }) => <h3 className="t-h3 text-foreground mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-foreground pl-6 my-8 italic t-body-lg text-foreground-muted">{children}</blockquote>,
  },
}

export default async function PacotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pacote: PacoteData | null = await client.fetch(PACOTE_BY_SLUG_QUERY, { slug })
  if (!pacote) notFound()

  const WA = "https://wa.me/5511966401489"

  /* remove a linha de passagem aérea do "incluso" em todo o site (não trabalham mais com aéreo) */
  const inclusoSemAerea = (pacote.incluso ?? []).filter(i => !/passagem|a[ée]re/i.test(i))

  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip">
      <MagneticCursor />
      <NavBar />

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section data-cms="hero" className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {pacote.heroImage
            ? <img src={urlFor(pacote.heroImage).width(1920).height(1080).fit("crop").url()} alt={pacote.titulo} className="w-full h-full object-cover" />
            : <ImagePlaceholder className="w-full h-full" iconSize={96} />
          }
        </div>
        <ImageOverlay blur={14} darkFrom={0.88} darkMid={0.25} blurStop="35%" blurFade="65%" />
        <div className="relative z-10 wrap pb-16 w-full">
          {pacote.badge && <StatusBadge badge={pacote.badge} className="mb-6" />}
          <LineReveal as="h1" className="t-hero text-white leading-none mb-6">
            {pacote.titulo.toUpperCase()}
          </LineReveal>
          <div className="flex flex-wrap gap-6 text-white/80 text-[16px]">
            {pacote.periodo  && <span className="flex items-center gap-2"><Clock    weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {pacote.periodo}</span>}
            {pacote.dias     && <span className="flex items-center gap-2"><Airplane weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {pacote.dias} dias</span>}
            {pacote.partida  && <span className="flex items-center gap-2"><MapPin   weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Partida: {pacote.partida}</span>}
            {pacote.vagas    && <span className="flex items-center gap-2"><Users    weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {pacote.vagas} vagas</span>}
          </div>
        </div>
      </section>

      {/* ══ BARRA INFO ═════════════════════════════════════ */}
      <div className="border-y border-border bg-background-elevated">
        <div className="wrap py-6">
          <div className="flex flex-wrap gap-8 items-center justify-between">
            <div className="flex flex-wrap gap-10">
              {[
                { label: "Duração",  value: pacote.dias    ? `${pacote.dias} dias` : "—" },
                { label: "Partida",  value: pacote.partida ?? "—" },
                { label: "Período",  value: pacote.periodo ?? "—" },
                { label: "Vagas",    value: pacote.vagas   ? `${pacote.vagas} por grupo` : "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="t-label mb-1">{label}</p>
                  <p className="text-[18px] font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <BtnForm pacote={pacote.titulo} tipo={pacote.tipo}>Quero este pacote</BtnForm>
          </div>
        </div>
      </div>

      {/* ══ INTRO EDITORIAL ════════════════════════════════ */}
      {pacote.intro && (
        <section className="py-20">
          <div className="wrap" style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
            <ScrollReveal>
              <p className="t-label mb-8 flex items-center gap-2">
                <Star weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Curadoria de Rodrigo Ruas
              </p>
              <PortableText value={pacote.intro} components={ptComponents} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ══ IMAGEM FULL WIDTH ══════════════════════════════ */}
      {pacote.galeria && pacote.galeria.length > 0 && (
        <RevealImage direction="up" className="overflow-hidden" data-cursor="expand" data-cursor-theme="dark">
          <div className="aspect-[21/9] group overflow-hidden">
            <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
              <img src={urlFor(pacote.galeria[0]).width(1920).fit("crop").url()}
                   alt={pacote.titulo} className="w-full h-full object-cover" />
            </div>
          </div>
        </RevealImage>
      )}

      {/* ══ PULL QUOTE ═════════════════════════════════════ */}
      {pacote.pullQuote && (
        <section className="border-t border-b border-border py-20 bg-background-section">
          <div className="wrap max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <p className="font-light italic text-foreground leading-relaxed"
                 style={{ fontSize: "clamp(22px,3vw,38px)" }}>
                "{pacote.pullQuote}"
              </p>
              <p className="t-label text-foreground-subtle mt-6">— Rodrigo Ruas</p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ══ ITINERÁRIO ═════════════════════════════════════ */}
      {pacote.itinerario && pacote.itinerario.length > 0 && (
        <RoteiroDias dias={pacote.itinerario} galeria={pacote.galeria} />
      )}

      {/* ══ GALERIA ════════════════════════════════════════ */}
      {pacote.galeria && pacote.galeria.length > 1 && (
        <section className="py-20 border-t border-border bg-background-section">
          <div className="wrap">
            <ScrollReveal>
              <p className="t-label mb-2">Galeria</p>
              <h2 className="t-h2 text-foreground mb-12">Imagens do destino</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pacote.galeria.slice(1).map((img, i) => (
                <RevealImage key={i} direction="up" delay={i * 0.06} className="overflow-hidden group" data-cursor="expand" data-cursor-theme="dark">
                  <div className="aspect-square transition-transform duration-700 group-hover:scale-[1.05]">
                    <img src={urlFor(img).width(600).height(600).fit("crop").url()} alt={`Foto ${i + 2}`}
                         className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </RevealImage>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ INCLUSO / NÃO INCLUSO — dois painéis ══════════ */}
      {(inclusoSemAerea.length || pacote.naoIncluso?.length) ? (
        <section className="border-t-2 border-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Painel INCLUSO — navy */}
            <div className="bg-foreground text-primary-foreground p-[clamp(32px,6vw,72px)]">
              <ScrollReveal>
                <p className="t-label !text-primary-foreground/75 mb-3">O que está incluso</p>
                <h3 className="font-bold text-primary-foreground mb-10"
                    style={{ fontSize: "clamp(32px,4vw,56px)", letterSpacing: "-0.02em" }}>
                  Incluso no pacote
                </h3>
              </ScrollReveal>
              <div className="flex flex-col divide-y divide-primary-foreground/10">
                {inclusoSemAerea.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.04} className="flex items-center gap-5 py-5">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                      <Check size={18} weight="bold" className="text-primary-foreground" />
                    </span>
                    <p className="text-[19px] font-medium text-primary-foreground leading-snug">{item}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Painel NÃO INCLUSO — claro */}
            <div className="bg-background-section p-[clamp(32px,6vw,72px)] border-t-2 lg:border-t-0 lg:border-l-2 border-foreground">
              <ScrollReveal>
                <p className="t-label text-foreground-subtle mb-3">O que não está incluso</p>
                <h3 className="font-bold text-foreground mb-10"
                    style={{ fontSize: "clamp(32px,4vw,56px)", letterSpacing: "-0.02em" }}>
                  Não incluso
                </h3>
              </ScrollReveal>
              <div className="flex flex-col divide-y divide-border">
                {(pacote.naoIncluso ?? []).map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.04} className="flex items-center gap-5 py-5">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-foreground/[0.08] flex items-center justify-center border border-border">
                      <X size={16} weight="bold" className="text-foreground-muted" />
                    </span>
                    <p className="text-[19px] text-foreground-muted leading-snug">{item}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>

          </div>
        </section>
      ) : null}

      {/* ══ CTA FINAL + TICKET ═════════════════════════════ */}
      <section className="relative bg-foreground text-primary-foreground py-24 overflow-hidden" data-cursor-theme="dark">

        {/* bg image do destino — deixa a foto respirar para o ticket navy destacar */}
        {pacote.heroImage && (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={urlFor(pacote.heroImage).width(1920).fit("crop").url()}
                alt=""
                className="w-full h-full object-cover opacity-60"
                aria-hidden
              />
            </div>
            <div className="absolute inset-0 z-[1] bg-black/45" />
          </>
        )}
        <div className="wrap relative z-[2]">

          {/* Texto acima — centrado */}
          <div className="mb-14 text-center">
            <ScrollReveal>
              <p className="t-label !text-primary-foreground/80 mb-4">Pronto para ir?</p>
            </ScrollReveal>
            <h2 className="t-h1 text-primary-foreground leading-none">
              Garanta sua vaga em {pacote.titulo}
              {pacote.periodo && <><br />— {pacote.periodo}.</>}
              {!pacote.periodo && "."}
            </h2>
          </div>

          {/* Ticket centrado abaixo */}
          <ScrollReveal delay={0.15} className="w-full max-w-[1180px] mx-auto">
            <PricingTicket
              titulo={pacote.titulo}
              tipo={pacote.tipo}
              tagline={pacote.tagline}
              destino={pacote.titulo}
              codPartida={pacote.aeroportoPartida}
              codDestino={pacote.aeroportoDestino}
              dataIda={pacote.dataIda}
              dataVolta={pacote.dataVolta}
              dias={pacote.dias}
              vagas={pacote.vagas}
              moeda={pacote.moeda}
              entrada={pacote.entrada}
              numParcelas={pacote.numParcelas}
              valorParcela={pacote.valorParcela}
              seguroValor={pacote.seguroValor}
              seguroStatus={pacote.seguroStatus}
              politicaCancelamento={pacote.politicaCancelamento}
              politicaReagendamento={pacote.politicaReagendamento}
              rodapeAtendimento={pacote.rodapeAtendimento}
              rodapeSeguranca={pacote.rodapeSeguranca}
              incluso={inclusoSemAerea}
            />
          </ScrollReveal>

        </div>
      </section>

      {/* ══ FOOTER SIMPLES ═════════════════════════════════ */}
      <footer className="py-8 border-t border-border">
        <div className="wrap flex justify-between items-center">
          <p className="font-bold tracking-tight text-foreground">RR VIAGENS</p>
          <TransitionLink href="/" className="t-small text-foreground-subtle hover:text-foreground transition-colors">
            ← Voltar para a home
          </TransitionLink>
        </div>
      </footer>
    </main>
  )
}
