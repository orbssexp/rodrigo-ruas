"use client"

import { useState, Suspense } from "react"
import { ScrollReveal, RevealImage, FlipText, BtnPrimary, TransitionLink } from "@/components/gsap"
import { ImagePlaceholder } from "@/components/gsap"
import { PriceCalculator } from "@/app/pacotes/selecao/PriceCalculator"
import { StatusBadge } from "@/components/StatusBadge"
import { Globe, Airplane } from "@phosphor-icons/react"
import { getUnsplash } from "@/lib/unsplash"

interface Pacote {
  _id: string
  titulo: string
  slug: string
  badge?: string | null
  heroImage?: any
  periodo?: string
  dias?: number
  partida?: string
  moeda?: string
  entrada?: number
  numParcelas?: number
  valorParcela?: number
  descricaoCurta?: string
}

/** total por pessoa (entrada + parcelas). Tudo em US$ hoje. */
function totalPacote(p: { entrada?: number; numParcelas?: number; valorParcela?: number }) {
  return (p.entrada ?? 0) + (p.numParcelas ?? 0) * (p.valorParcela ?? 0)
}

function imageUrl(p: Pacote) {
  if (!p.heroImage?.asset?._ref) return getUnsplash(p.slug, "md")
  const ref = p.heroImage.asset._ref.replace("image-", "").replace(/-(\w+)$/, ".$1")
  return `https://cdn.sanity.io/images/6g3tj20r/production/${ref}?w=700&fit=crop`
}

function Card({ p }: { p: Pacote }) {
  return (
    <div
      className={`group border border-border transition-colors overflow-hidden
                  ${p.badge === "esgotado" ? "opacity-60 grayscale-[40%] cursor-default" : "hover:border-foreground/25"}`}
      data-cursor={p.badge !== "esgotado" ? "expand" : undefined}
      data-cursor-label="VER"
    >
      <RevealImage direction="up" className="overflow-hidden" data-cursor-theme="dark">
        <div className="aspect-[3/2] relative overflow-hidden">
          <div className={`absolute inset-0 transition-transform duration-700 ${p.badge !== "esgotado" ? "group-hover:scale-[1.05]" : ""}`}>
            {(() => {
              const src = imageUrl(p)
              return src
                ? <img src={src} alt={p.titulo} className="w-full h-full object-cover" loading="lazy" />
                : <ImagePlaceholder className="w-full h-full" iconSize={36} />
            })()}
          </div>
        </div>
      </RevealImage>
      <div className="p-7">
        <div className="flex items-center justify-between gap-3 mb-2">
          <FlipText as="h3" className="text-[26px] font-bold text-foreground" stagger={0.013}>
            {p.titulo.toUpperCase()}
          </FlipText>
          {p.badge && <StatusBadge badge={p.badge} />}
        </div>
        <p className="text-primary text-[20px] mb-6">{p.periodo} · {p.dias} dias</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-border">
          <p className="text-[20px] font-medium flex items-center gap-2 text-primary">
            <Airplane weight="fill" className="w-5 h-5 shrink-0" /> {p.partida ?? "—"}
          </p>
          {p.badge === "esgotado" ? (
            <span className="text-[20px] text-foreground-subtle">Sem vagas</span>
          ) : (
            <TransitionLink href={`/pacotes/${p.slug}`}>
              <BtnPrimary variant="outline" stagger={0.013}>Ver pacote</BtnPrimary>
            </TransitionLink>
          )}
        </div>
      </div>
    </div>
  )
}

export function DestinosSection({
  grupos,
  assinados,
}: {
  grupos:    Pacote[]
  assinados: Pacote[]
}) {
  const [precoMax, setPrecoMax] = useState(0)

  const filtrar = (list: Pacote[]) =>
    precoMax === 0 ? list : list.filter(p => { const t = totalPacote(p); return !t || t <= precoMax })

  const gruposFiltrados    = filtrar(grupos)
  const assinadosFiltrados = filtrar(assinados)
  const semResultado       = gruposFiltrados.length === 0 && assinadosFiltrados.length === 0

  return (
    <section id="destinos" className="py-20 border-t border-border">
      <div className="wrap">

        {/* Header */}
        <ScrollReveal className="flex justify-between items-end mb-6">
          <div>
            <p className="t-label mb-2">Destinos</p>
            <h2 className="t-h2 text-foreground">Onde você quer ir?</h2>
          </div>
          <p className="t-small hidden md:flex items-center gap-2 text-foreground-subtle">
            <Globe weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> 141+ roteiros ativos
          </p>
        </ScrollReveal>

        {/* Filtro de preço — inline, sem redirect */}
        <div className="mb-12">
          <Suspense>
            <PriceCalculator
              theme="light"
              value={precoMax}
              onChange={setPrecoMax}
            />
          </Suspense>
        </div>

        {semResultado && (
          <p className="t-body text-foreground-muted py-12 text-center">
            Nenhum pacote encontrado nessa faixa. Tente um valor maior ou{" "}
            <TransitionLink href="/pacotes/selecao" className="underline">veja todos os pacotes</TransitionLink>.
          </p>
        )}

        {/* Fileira 1 — Grupos do Ruas */}
        {gruposFiltrados.length > 0 && (
          <div className="mb-14">
            <ScrollReveal className="flex items-center justify-between mb-8">
              <p className="t-label">Grupos do Ruas</p>
              <TransitionLink href="/pacotes/selecao"
                className="t-label text-foreground-muted hover:text-foreground transition-colors">
                Ver todos →
              </TransitionLink>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gruposFiltrados.map((p, i) => (
                <ScrollReveal key={p._id} delay={i * 0.07}>
                  <Card p={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Fileira 2 — Pacotes Assinados */}
        {assinadosFiltrados.length > 0 && (
          <div>
            <ScrollReveal className="flex items-center justify-between mb-8">
              <p className="t-label">Pacotes</p>
              <TransitionLink href="/pacotes/selecao"
                className="t-label text-foreground-muted hover:text-foreground transition-colors">
                Ver todos →
              </TransitionLink>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assinadosFiltrados.map((p, i) => (
                <ScrollReveal key={p._id} delay={i * 0.07}>
                  <Card p={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
