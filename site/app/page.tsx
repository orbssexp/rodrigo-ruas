/* Revalida a cada 60s — mudan�as no Sanity aparecem em at� 1 minuto */
export const revalidate = 60

import {
  NavBar, HeroSection, ScrollReveal,
  CountUp, FlipText, ImagePlaceholder,
  LineReveal, RevealImage, BtnPrimary, MagneticCursor,
  PackagesReel, TransitionLink,
} from "@/components/gsap"
import {
  Globe, Users, MapPin, Clock, Airplane, Star, Phone,
} from "@phosphor-icons/react/dist/ssr"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { HOMEPAGE_QUERY, HOMEPAGE_CONTENT_QUERY } from "@/sanity/lib/queries"
import { getUnsplash, UNSPLASH } from "@/lib/unsplash"
import { ImageOverlay } from "@/components/ImageOverlay"
import { PriceCalculator } from "@/app/pacotes/selecao/PriceCalculator"
import { BtnForm } from "@/components/BtnForm"
import { DestinosSection } from "@/components/DestinosSection"
import { StatusBadge } from "@/components/StatusBadge"
import { Suspense } from "react"

const stats = [
  { value: 93,   suffix: "",  label: "países visitados",    Icon: Globe   },
  { value: 19,   suffix: "+", label: "anos de experiência", Icon: Star    },
  { value: 1500, suffix: "+", label: "viajantes levados",   Icon: Users   },
  { value: 40,   suffix: "+", label: "destinos ativos",     Icon: MapPin  },
]

const passos = [
  { n: "01", Icon: MapPin,   t: "Escolha seu destino",   b: "Mais de 40 países com saídas programadas." },
  { n: "02", Icon: Phone,    t: "Fale com nossa equipe", b: "Atendimento direto. Pessoa real, sem robô." },
  { n: "03", Icon: Airplane, t: "Apareça no aeroporto",  b: "Passagem, hotel, passeios. O resto é com a gente." },
]

const galeria  = [
  { label: "Japão",    slug: "japao"    },
  { label: "Turquia",  slug: "turquia"  },
  { label: "Grécia",   slug: "grecia"   },
  { label: "Croácia",  slug: "croacia"  },
]
const pequenos = [
  { label: "China",      slug: "china"    },
  { label: "Sri Lanka",  slug: "srilanka" },
  { label: "Marrocos",   slug: "marrocos" },
  { label: "Ushuaia",    slug: "ushuaia"  },
]

/* ─── PAGE ───────────────────────────────────────────────── */
export default async function Home() {
  /* Busca do Sanity — fallback silencioso se n�o configurado */
  let grupos:          any[]      = []
  let assinados:       any[]      = []
  let cms:             any        = null
  try {
    const [homeData, cmsData] = await Promise.all([
      client.fetch(HOMEPAGE_QUERY),
      client.fetch(HOMEPAGE_CONTENT_QUERY),
    ])
    grupos         = homeData?.gruposDoRuas      ?? []
    assinados      = homeData?.assinadoByRuas    ?? []
    cms            = cmsData ?? null
  } catch {}

  /* Textos com fallback */
  const copy = {
    heroLabel: cms?.heroLabel ?? "Curadoria de Expert",
    heroLine1: cms?.heroLine1 ?? "PACOTES",
    heroLine2: cms?.heroLine2 ?? "PELO MUNDO",
    heroSub:   cms?.heroSub   ?? "Curadoria de expert para viajantes exigentes.\n93 países. 19 anos de estrada.",
    stats: cms?.stats ?? [
      { valor: 93,   sufixo: "",  label: "países visitados"    },
      { valor: 19,   sufixo: "+", label: "anos de experiência" },
      { valor: 1500, sufixo: "+", label: "viajantes levados"   },
      { valor: 40,   sufixo: "+", label: "destinos ativos"     },
    ],
    passos: cms?.passos ?? [
      { numero: "01", titulo: "Escolha seu destino",   corpo: "Mais de 40 países com saídas programadas." },
      { numero: "02", titulo: "Fale com nossa equipe", corpo: "Atendimento direto. Pessoa real, sem robô." },
      { numero: "03", titulo: "Apareça no aeroporto",  corpo: "Passagem, hotel, passeios. O resto é com a gente." },
    ],
    depoimento: cms?.depoimentoTexto ?? "Eu nunca tinha viajado para fora do Brasil. Com o Rodrigo, fui para o Japão e voltei diferente.",
    depoimentoAutor: cms?.depoimentoAutor ?? "Maria C., São Paulo",
    ctaTitulo:    cms?.ctaTitulo    ?? "Sua próxima viagem começa com uma mensagem.",
    ctaSubtitulo: cms?.ctaSubtitulo ?? "Vagas limitadas. Atendimento personalizado. Sem chatbot, sem fila.",
    /* Seções de produto */
    sec: {
      grupos:    { label: cms?.secaoGruposLabel    ?? "Viaje comigo",       titulo: cms?.secaoGruposTitulo    ?? "Grupos do Ruas",                    desc: cms?.secaoGruposDesc    ?? "Viagens exclusivas onde Rodrigo está presente em cada passo do roteiro." },
      assinados: { label: cms?.secaoAssinadosLabel ?? "Curadoria validada", titulo: cms?.secaoAssinadosTitulo ?? "Pacotes Assinados by Ruas",          desc: cms?.secaoAssinadosDesc ?? "Roteiros desenhados e aprovados pelo Rodrigo. Executados com o padrão dele." },
    },
  }

  /* Sem pacotes no CMS = seção não aparece (nada de pacote de exemplo) */
  const destaqueGrupos    = grupos.find(p => p.prioridade === "destaque") ?? grupos[0] ?? null
  const destaqueAssinados = assinados[0] ?? null

  return (
    <main data-page-content className="bg-background text-foreground overflow-x-clip">
      <MagneticCursor />
      <NavBar />

      {/* �� HERO ������������������������������������������� */}
      <HeroSection
        label={copy.heroLabel}
        line1={copy.heroLine1}
        line2={copy.heroLine2}
        sub={copy.heroSub}
        slides={cms?.heroSlides ?? []}
      />

      {/* �� DIVIDER ���������������������������������������� */}
      <div className="wrap">
        <ScrollReveal><div className="border-t-2 border-foreground" /></ScrollReveal>
      </div>

      {/* �� SEÇÃO 1 — GRUPOS DO RUAS (premium) ������������ */}
      {grupos.length > 0 && (
      <section id="pacotes" className="py-16">
        {/* Header da se��o */}
        <div className="wrap mb-10">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="t-label mb-2">{copy.sec.grupos.label}</p>
              <h2 className="t-h2 text-foreground">{copy.sec.grupos.titulo}</h2>
            </div>
            <p className="t-body max-w-sm text-foreground-muted md:text-right">
              {copy.sec.grupos.desc}
            </p>
          </ScrollReveal>
        </div>

        {/* Card destaque sticky */}
        {destaqueGrupos && (
          <div className="wrap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
              <div className="relative overflow-hidden aspect-[4/3]"
                   data-cursor="expand" data-cursor-label="VER PACOTE" data-cursor-theme="dark">
                <RevealImage direction="up" className="absolute inset-0">
                  <div className="absolute inset-0 overflow-hidden group">
                    <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
                      {(() => {
                        const src = destaqueGrupos.heroImage
                          ? urlFor(destaqueGrupos.heroImage).width(900).fit("crop").url()
                          : getUnsplash(destaqueGrupos.slug, "lg")
                        return src
                          ? <img src={src} alt={destaqueGrupos.titulo} className="w-full h-full object-cover" />
                          : <ImagePlaceholder className="w-full h-full" iconSize={64} />
                      })()}
                    </div>
                  </div>
                </RevealImage>
                {destaqueGrupos.badge && (
                  <span className="absolute top-5 left-5 z-10 flex items-center gap-1.5
                                   bg-warning/90 text-white text-[20px] font-bold
                                   tracking-wide uppercase px-4 py-2 rounded-full">
                    <Clock size={14} weight="bold" />
                    {destaqueGrupos.badge === "vagas" ? "Últimas Vagas" : "Esgotado"}
                  </span>
                )}
              </div>
              <div className="p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-center">
                <ScrollReveal>
                  <p className="t-label text-foreground-subtle mb-4">Destino em destaque</p>
                </ScrollReveal>
                <LineReveal as="h2" className="t-h1 text-foreground mb-4 leading-none">
                  {destaqueGrupos.titulo.toUpperCase()}
                </LineReveal>
                <ScrollReveal delay={0.1}>
                  <p className="t-body-lg mb-6">
                    {destaqueGrupos.descricaoCurta ?? `${destaqueGrupos.periodo ?? ""} · ${destaqueGrupos.dias ?? ""} dias`}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.2} className="flex flex-wrap gap-6 mb-8 border-t border-border pt-6">
                  {([
                    { n: destaqueGrupos.dias    ? String(destaqueGrupos.dias)    : "—", l: "dias",    Icon: Clock    },
                    { n: destaqueGrupos.partida ?? "—",                                  l: "partida", Icon: Airplane },
                    { n: destaqueGrupos.vagas   ? String(destaqueGrupos.vagas)   : "—", l: "vagas",   Icon: Users    },
                  ] as {n:string,l:string,Icon:any}[]).map(({ n, l, Icon }) => (
                    <div key={l}>
                      <p className="text-[36px] font-bold text-foreground leading-none">{n}</p>
                      <p className="t-label mt-1 flex items-center gap-1"><Icon weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {l}</p>
                    </div>
                  ))}
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <TransitionLink href={`/pacotes/${destaqueGrupos.slug}`}>
                    <BtnPrimary>Ver o pacote completo</BtnPrimary>
                  </TransitionLink>
                </ScrollReveal>
              </div>
            </div>
          </div>
        )}

        {/* Carrossel com o restante dos grupos */}
        {grupos.length > 1 && (
          <>
            <div className="wrap border-t border-border pt-10 pb-4 mt-16">
              <p className="text-[20px] font-medium text-foreground-subtle">mais grupos → scroll para explorar</p>
            </div>
            <PackagesReel pacotes={grupos.slice(1)} />
          </>
        )}
      </section>
      )}

      {/* �� SEÇÃO 2 — PACOTES ASSINADOS — grid de cards ���� */}
      {assinados.length > 0 && (
      <section className="py-20 border-t-2 border-foreground">
          <div className="wrap">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="t-label mb-2">{copy.sec.assinados.label}</p>
                <h2 className="t-h2 text-foreground">{copy.sec.assinados.titulo}</h2>
              </div>
              <p className="t-body max-w-sm text-foreground-muted md:text-right">
                {copy.sec.assinados.desc}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assinados.map((p: any, i: number) => (
                <ScrollReveal key={p._id} delay={i * 0.07}
                  className="group border border-border hover:border-foreground/25 transition-colors overflow-hidden"
                  data-cursor="expand" data-cursor-label="VER">
                  <RevealImage direction="up" className="overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden">
                      <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.05]">
                        {(() => {
                          const src = p.heroImage ? urlFor(p.heroImage).width(700).fit("crop").url() : getUnsplash(p.slug, "md")
                          return src ? <img src={src} alt={p.titulo} className="w-full h-full object-cover" loading="lazy" /> : <ImagePlaceholder className="w-full h-full" iconSize={36} />
                        })()}
                      </div>
                    </div>
                  </RevealImage>
                  <div className="p-6">
                    {p.badge && (
                      <StatusBadge badge={p.badge} className="mb-3" />
                    )}
                    <FlipText as="h3" className="text-[20px] font-bold text-foreground mb-1" stagger={0.013}>
                      {p.titulo.toUpperCase()}
                    </FlipText>
                    <p className="t-body mb-5">{p.periodo} · {p.dias} dias</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <p className="t-small flex items-center gap-1.5">
                        <Airplane weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> {p.partida ?? "—"}
                      </p>
                      <TransitionLink href={`/pacotes/${p.slug}`}>
                        <BtnPrimary variant="outline" stagger={0.013}>Ver pacote</BtnPrimary>
                      </TransitionLink>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* �� FAIXA — QUEM É RODRIGO ������������������������� */}
      <section className="border-t-2 border-b-2 border-foreground py-16">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-center">
            <RevealImage direction="up" className="overflow-hidden group"
                         data-cursor="expand" data-cursor-label="RODRIGO">
              <div className="w-full transition-transform duration-700 group-hover:scale-[1.04]">
                <img src={cms?.rodrigoFotoUrl ?? UNSPLASH.rodrigo} alt="Rodrigo Ruas"
                     className="w-full aspect-[3/4] max-w-xs mx-auto lg:mx-0 object-cover" loading="lazy" />
              </div>
            </RevealImage>
            <div>
              <ScrollReveal><p className="t-label mb-4">Quem é Rodrigo Ruas</p></ScrollReveal>
              <LineReveal as="h2" className="t-h2 text-foreground mb-6">
                Já estive em 93 países. Sei o que vale cada hora, cada hotel, cada rota.
              </LineReveal>
              <ScrollReveal delay={0.15}>
                <p className="t-body-lg mb-8">
                  Em 19 anos de estrada, Rodrigo conduziu mais de 1.500 viajantes pelo mundo.
                  Não é agente de viagens — é um <em>especialista</em> que já foi em cada destino que vende.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <BtnForm>Falar com Rodrigo</BtnForm>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* �� DESTINOS — cards por tipo ���������������������� */}
       {(grupos.length > 0 || assinados.length > 0) && (
         <DestinosSection grupos={grupos} assinados={assinados} />
       )}

      {/* �� PULL QUOTE ������������������������������������� */}
      <section className="bg-background-section py-20 border-t border-b border-border">
        <div className="wrap">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Star size={28} className="mx-auto mb-6 text-foreground-subtle" weight="fill" />
            </ScrollReveal>
            <LineReveal as="p"
              className="font-light italic text-foreground leading-relaxed mb-6"
              style={{ fontSize: "clamp(20px,2.8vw,34px)" } as React.CSSProperties}
            >
              {copy.depoimento}
            </LineReveal>
            <ScrollReveal delay={0.2}>
              <cite className="t-label text-foreground-subtle not-italic">— {copy.depoimentoAutor}</cite>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* �� PROCESSO ��������������������������������������� */}
      <section className="py-20">
        <div className="wrap">
          <ScrollReveal><p className="t-label mb-2">O processo</p></ScrollReveal>
          <LineReveal as="h2" className="t-h2 text-foreground mb-16">É simples assim:</LineReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {copy.passos.map(({ numero, titulo, corpo }: any, i: number) => {
              const Icon = passos[i]?.Icon ?? MapPin
              return (
                <ScrollReveal key={numero} delay={i * 0.12} className="border-t-2 border-foreground pt-6">
                  <p className="text-[72px] font-bold text-foreground/10 leading-none mb-4">{numero}</p>
                  <Icon size={32} className="mb-4 text-foreground-muted md:text-[32px] text-[20px]" weight="bold" />
                  <p className="text-[22px] font-bold text-foreground mb-3">{titulo}</p>
                  <p className="t-body">{corpo}</p>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* �� NÚMEROS ���������������������������������������� */}
      <section className="bg-foreground text-primary-foreground py-20" data-cursor-theme="dark">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {copy.stats.map(({ valor, sufixo, label }: any, i: number) => {
              const Icon = stats[i]?.Icon ?? Globe
              return (
                <ScrollReveal key={label} delay={i * 0.1} className="border-t border-primary-foreground/20 pt-6">
                  <Icon size={32} className="mb-4 text-primary-foreground/60 md:text-[32px] text-[20px]" weight="bold" />
                  <p className="font-bold leading-none tracking-tight text-primary-foreground"
                     style={{ fontSize: "clamp(48px,6vw,88px)" }}>
                    <CountUp value={valor} suffix={sufixo ?? ""} />
                  </p>
                  <p className="text-[20px] font-semibold tracking-[0.1em] uppercase text-primary-foreground/75 mt-2">
                    {label}
                  </p>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* �� CTA FINAL �������������������������������������� */}
      <section id="contato" className="py-24 text-center">
        <div className="wrap">
          <ScrollReveal><p className="t-label mb-4">Reserve agora</p></ScrollReveal>
          <LineReveal as="h2" className="t-h1 text-foreground mb-6 mx-auto max-w-2xl">
            {copy.ctaTitulo}
          </LineReveal>
          <ScrollReveal delay={0.15}>
            <p className="t-body-lg mb-10 max-w-lg mx-auto">
              {copy.ctaSubtitulo}
            </p>
            <BtnForm>Falar no WhatsApp agora</BtnForm>
            <p className="t-small mt-4 flex items-center justify-center gap-2 text-foreground-subtle">
              <Clock weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Resposta em até 1 hora · (11) 96640-1489
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* �� FOOTER ����������������������������������������� */}
      <footer id="sobre" className="bg-foreground text-primary-foreground py-16" data-cursor-theme="dark">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            <div>
              <FlipText as="p" className="text-[22px] font-bold tracking-tight text-primary-foreground mb-1" stagger={0.02}>
                RR VIAGENS
              </FlipText>
              <p className="text-primary-foreground/75 text-[20px]">Pacotes pelo Mundo</p>
            </div>
            <div className="flex flex-wrap gap-16">
              <div className="flex flex-col gap-4">
                {["Pacotes","Destinos","Sobre","Contato"].map(l => (
                  <FlipText key={l} as="a" href={`#${l.toLowerCase()}`}
                    className="text-[20px] text-primary-foreground/80" stagger={0.016}>
                    {l}
                  </FlipText>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://instagram.com/rodrigoruas"
                   className="text-[20px] text-primary-foreground/80 flex items-center gap-2 hover:text-primary-foreground transition-colors">
                  <MapPin weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> @rodrigoruas
                </a>
                <a href="https://wa.me/5511966401489"
                   className="text-[20px] text-primary-foreground/80 flex items-center gap-2 hover:text-primary-foreground transition-colors">
                  <Phone weight="fill" className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> (11) 96640-1489
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 border-t border-primary-foreground/10 pt-6">
            <p className="text-[20px] text-primary-foreground/30">© 2026 RR Viagens — CNPJ 52.437.341/0001-22</p>
            <p className="text-[20px] text-primary-foreground/20">Feito com amor no Brasil</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

