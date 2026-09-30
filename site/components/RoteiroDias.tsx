/* Roteiro dia a dia — layout editorial e visual (referência: página de projeto
   Saisei): rótulo "Dia 03", título, resumo grande, foto grande e uma tabela
   curta de "Detalhes". Os destaques do dia aparecem como etiquetas (nomes curtos).
   Desktop: foto de um lado, texto do outro, alternando. Mobile: texto → foto → detalhes. */

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { ScrollReveal, LineReveal, RevealImage, ImagePlaceholder } from "@/components/gsap"
import { urlFor } from "@/sanity/lib/image"

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Dia {
  numero: number
  titulo: string
  resumo?: string
  passeios?: string[]
  refeicoes?: string
  hospedagem?: string
  opcionais?: string[]
  observacao?: string
  texto?: any[]          /* formato antigo — só usado se não houver resumo */
  imagem?: any
}

const pad = (n: number) => String(n).padStart(2, "0")

const textoAntigo: PortableTextComponents = {
  block: { normal: ({ children }) => <p className="t-body-lg mb-4 leading-relaxed">{children}</p> },
}

export function RoteiroDias({ dias, galeria = [] }: { dias: Dia[]; galeria?: any[] }) {
  return (
    <section className="py-20 border-t border-border">
      <div className="wrap">
        <ScrollReveal><p className="t-label mb-2">O roteiro</p></ScrollReveal>
        <LineReveal as="h2" className="t-h2 text-foreground mb-6">Dia a dia</LineReveal>

        <ol className="list-none">
          {dias.map((dia, i) => {
            /* sem foto própria, usa a da galeria no mesmo índice (sem repetir em ciclo) */
            const foto = dia.imagem ?? galeria[i] ?? null
            const par = i % 2 === 1   /* alterna o lado da foto no desktop */

            const detalhes = [
              dia.passeios?.length && { rotulo: "Destaques", valor: dia.passeios, etiquetas: true },
              dia.refeicoes && { rotulo: "Refeições", valor: dia.refeicoes },
              dia.hospedagem && { rotulo: "Hospedagem", valor: dia.hospedagem },
              dia.opcionais?.length && { rotulo: "Opcional", valor: dia.opcionais.join(" · ") },
              dia.observacao && { rotulo: "Atenção", valor: dia.observacao },
            ].filter(Boolean) as { rotulo: string; valor: string | string[]; etiquetas?: boolean }[]

            return (
              <li
                key={i}
                className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-x-16 gap-y-8 py-14 lg:py-20 border-t border-border"
              >
                {/* ── cabeçalho + resumo ─────────────────── */}
                <ScrollReveal className={`${par ? "lg:col-start-1" : "lg:col-start-2"} lg:row-start-1 lg:self-end`}>
                  <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-foreground mb-5">Dia {pad(dia.numero)}</p>
                  <h3 className="t-h3 text-foreground mb-5">{dia.titulo}</h3>
                  {dia.resumo ? (
                    <p className="text-[clamp(21px,1.9vw,28px)] leading-[1.4] text-foreground max-w-[34ch]">{dia.resumo}</p>
                  ) : (
                    dia.texto && <PortableText value={dia.texto} components={textoAntigo} />
                  )}
                </ScrollReveal>

                {/* ── foto grande ─────────────────────────── */}
                <div className={`${par ? "lg:col-start-2" : "lg:col-start-1"} lg:row-start-1 lg:row-span-2`}>
                  <RevealImage direction="up" className="overflow-hidden group" data-cursor="expand" data-cursor-theme="dark">
                    <div className="aspect-[4/3] lg:aspect-[5/6] relative overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                        {foto ? (
                          <img src={urlFor(foto).width(1100).height(1320).fit("crop").url()} alt={dia.titulo}
                               className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <ImagePlaceholder className="w-full h-full" iconSize={40} />
                        )}
                      </div>
                    </div>
                  </RevealImage>
                </div>

                {/* ── detalhes (tabela curta) ─────────────── */}
                {detalhes.length > 0 && (
                  <ScrollReveal className={`${par ? "lg:col-start-1" : "lg:col-start-2"} lg:row-start-2 lg:self-start`}>
                    <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-foreground mb-1">Detalhes</p>
                    <dl>
                      {detalhes.map(({ rotulo, valor, etiquetas }) => (
                        <div key={rotulo} className="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-6 py-3.5 border-b border-foreground/20 items-center">
                          <dt className="text-[14px] font-semibold uppercase tracking-[0.06em] text-foreground">{rotulo}</dt>
                          <dd className="text-[17px] leading-snug text-foreground-muted">
                            {etiquetas && Array.isArray(valor) ? (
                              <span className="flex flex-wrap gap-2">
                                {valor.map((v) => (
                                  <span key={v} className="rounded-full border border-foreground/20 px-3 py-1 text-[15px] text-foreground whitespace-nowrap">
                                    {v}
                                  </span>
                                ))}
                              </span>
                            ) : valor}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </ScrollReveal>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
