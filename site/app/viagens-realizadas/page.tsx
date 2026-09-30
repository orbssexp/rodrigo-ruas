export const revalidate = 60

import type { Metadata } from "next"
import { Camera, MapPin } from "@phosphor-icons/react/dist/ssr"
import { NavBar, MagneticCursor, ScrollReveal, RevealImage, TransitionLink, BtnPrimary } from "@/components/gsap"
import { BtnForm } from "@/components/BtnForm"
import { client } from "@/sanity/lib/client"
import { VIAGENS_REALIZADAS_QUERY } from "@/sanity/lib/queries"
import { ViagensSlider } from "./ViagensSlider"
import { fotosLabel, toSlide, type ViagemRaw } from "./lib"

export const metadata: Metadata = {
  title: "Viagens realizadas — RR Viagens",
  description: "Galeria de fotos das viagens que o Rodrigo Ruas e a RR Viagens já fizeram pelo mundo.",
}

export default async function ViagensRealizadasPage() {
  let raws: ViagemRaw[] = []
  try { raws = await client.fetch(VIAGENS_REALIZADAS_QUERY) } catch {}
  const slides = raws.map(toSlide)

  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip">
      <MagneticCursor />
      <NavBar />

      {slides.length === 0 ? (
        /* ── sem viagens cadastradas ─────────────────────────── */
        <section className="wrap pt-40 pb-32 min-h-[80svh] flex flex-col justify-center">
          <p className="t-label mb-4">Galeria</p>
          <h1 className="t-h1 text-foreground mb-6">Viagens realizadas</h1>
          <p className="t-body-lg max-w-xl mb-10">
            Em breve você vai ver aqui as fotos das viagens que já fizemos pelo mundo.
          </p>
          <div><BtnForm>Viajar com o Rodrigo</BtnForm></div>
        </section>
      ) : (
        <>
          <ViagensSlider slides={slides} />

          {/* ── todos os destinos, em grade ───────────────────── */}
          <section className="py-20 border-t-2 border-foreground">
            <div className="wrap">
              <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                <div>
                  <p className="t-label mb-2">{slides.length} {slides.length === 1 ? "destino" : "destinos"}</p>
                  <h2 className="t-h2 text-foreground">Todas as viagens</h2>
                </div>
                <p className="t-body max-w-sm md:text-right">
                  Escolha um destino para ver as fotos de quem já viajou com a gente.
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((v, i) => (
                  <ScrollReveal key={v.id} delay={i * 0.05} className="group border border-border hover:border-foreground/25 transition-colors overflow-hidden">
                    <TransitionLink href={`/viagens-realizadas/${v.slug}`} className="block">
                      <RevealImage direction="up" className="overflow-hidden" data-cursor-theme="dark" data-cursor="expand" data-cursor-label="VER FOTOS">
                        <div className="aspect-[3/2] relative overflow-hidden">
                          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
                            <img src={v.thumb} alt={v.titulo} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </div>
                      </RevealImage>
                    </TransitionLink>
                    <div className="p-6">
                      <h3 className="text-[22px] font-bold uppercase text-foreground mb-1">{v.titulo}</h3>
                      <p className="text-primary text-[17px] mb-5 flex items-center gap-1.5">
                        {v.local && <><MapPin weight="fill" className="w-4 h-4 md:w-5 md:h-5 shrink-0" />{v.local}</>}
                        {v.local && v.quando && <span className="text-foreground-subtle"> · </span>}
                        {v.quando}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="t-small flex items-center gap-1.5">
                          <Camera weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {fotosLabel(v.totalFotos)}
                        </p>
                        <TransitionLink href={`/viagens-realizadas/${v.slug}`}>
                          <BtnPrimary variant="outline" stagger={0.013}>Ver fotos</BtnPrimary>
                        </TransitionLink>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── chamada final ─────────────────────────────────── */}
          <section className="bg-foreground py-20" data-cursor-theme="dark">
            <div className="wrap flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="t-label !text-primary-foreground/75 mb-3">Próxima viagem</p>
                <h2 className="t-h2 text-primary-foreground max-w-2xl">A próxima foto dessa galeria pode ser sua.</h2>
              </div>
              <BtnForm variant="inverted">Viajar com o Rodrigo</BtnForm>
            </div>
          </section>
        </>
      )}

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
