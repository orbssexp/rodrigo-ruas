import { NavBar, ScrollReveal, LineReveal, RevealImage } from "@/components/gsap"
import { BtnPrimary } from "@/components/gsap/BtnPrimary"
import { getUnsplash, UNSPLASH } from "@/lib/unsplash"
import { BtnForm } from "@/components/BtnForm"

const STATS = [
  { n: "93",     l: "países visitados"  },
  { n: "19+",    l: "anos de estrada"   },
  { n: "1.500+", l: "viajantes guiados" },
  { n: "40+",    l: "destinos ativos"   },
]

const FOTOS = [
  { slug: "japao",    label: "Japão"         },
  { slug: "turquia",  label: "Turquia"        },
  { slug: "grecia",   label: "Grécia"         },
  { slug: "croacia",  label: "Croácia"        },
  { slug: "china",    label: "China"          },
  { slug: "ushuaia",  label: "Ushuaia"        },
  { slug: "marrocos", label: "Marrocos"       },
  { slug: "india",    label: "Índia"          },
  { slug: "srilanka", label: "Sri Lanka"      },
  { slug: "egito",    label: "Egito"          },
  { slug: "canada",   label: "Canadá"         },
  { slug: "toscana",  label: "Toscana"        },
]

export default function SobrePage() {
  return (
    <main className="bg-background text-foreground">
      <NavBar />

      {/* Hero */}
      <section className="wrap pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <ScrollReveal>
              <p className="t-label mb-4">Quem é Rodrigo Ruas</p>
            </ScrollReveal>
            <LineReveal as="h1" className="t-h1 text-foreground leading-none">
              93 países. 19 anos de estrada.
            </LineReveal>
            <ScrollReveal delay={0.1}>
              <p className="t-body-lg mb-4">
                Rodrigo Ruas não é agente de viagens — é um viajante profissional que já
                filmou seu programa em 93 países. Desde 2019, conduz grupos
                pelo mundo e já levou mais de 1.500 pessoas a destinos que só ele conhece
                como ninguém.
              </p>
              <p className="t-body-lg mb-10">
                A diferença: a equipe da RR Viagens também coloca o pé na estrada. Viaja,
                explora e vive na prática cada destino antes de oferecer. Isso permite
                entender profundamente o que faz uma viagem ser inesquecível — e o que
                deve ser evitado. Atenção aos detalhes, segurança e autenticidade em cada roteiro.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}
              className="grid grid-cols-2 gap-6 mb-10 border-t border-border pt-8">
              {STATS.map(({ n, l }) => (
                <div key={l}>
                  <p className="text-[36px] font-bold text-foreground leading-none">{n}</p>
                  <p className="t-label mt-1">{l}</p>
                </div>
              ))}
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <BtnForm>Viajar com o Rodrigo</BtnForm>
            </ScrollReveal>
          </div>

          <RevealImage direction="up" className="overflow-hidden">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={UNSPLASH.rodrigo}
                alt="Rodrigo Ruas"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      {/* Storytelling */}
      <section className="border-t border-border bg-background-section py-20">
        <div className="wrap max-w-3xl">
          <ScrollReveal>
            <p className="t-label mb-6">A história</p>
            <p className="t-body-lg mb-6">
              Rodrigo Ruas é viajante profissional há mais de 19 anos. Já gravou seu programa
              de viagens em 93 países diferentes — explorando culturas e paisagens únicas em
              cada canto do planeta. Não é um turista. É alguém que vive de viajar e entende
              cada destino que vende.
            </p>
            <p className="t-body-lg mb-6">
              Em 2019, fundou a RR Viagens para compartilhar essa experiência com outros
              viajantes. Em 6 anos de operação, já levou mais de 1.500 pessoas para destinos
              ao redor do mundo — com grupos cuidadosamente planejados e vivências que não
              existem em nenhum pacote de agência convencional.
            </p>
            <p className="t-body-lg">
              Os pilares da RR Viagens: atenção aos detalhes, segurança e autenticidade.
              A equipe viaja antes de vender. Conhece cada hotel, cada guia, cada restaurante.
              Isso é curadoria de verdade.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Galeria de destinos */}
      <section className="border-t border-border py-20">
        <div className="wrap">
          <ScrollReveal className="mb-12">
            <p className="t-label mb-2">Onde j� estivemos</p>
            <h2 className="t-h2 text-foreground">Destinos com a marca Ruas</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FOTOS.map(({ slug, label }, i) => (
              <ScrollReveal key={slug} delay={i * 0.06}
                className="relative overflow-hidden group aspect-[4/3]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
                  <img
                    src={getUnsplash(slug, "md") ?? ""}
                    alt={label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent pointer-events-none" />
                <p className="absolute bottom-4 left-4 text-[20px] font-bold text-white uppercase">
                  {label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground py-20" data-cursor-theme="dark">
        <div className="wrap text-center">
          <ScrollReveal>
            <LineReveal as="h2" className="t-h1 text-primary-foreground mb-6 max-w-2xl mx-auto">
              Pronto para viajar com quem conhece cada destino?
            </LineReveal>
            <BtnForm className="!bg-primary-foreground !text-primary">Falar com o Rodrigo</BtnForm>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}

