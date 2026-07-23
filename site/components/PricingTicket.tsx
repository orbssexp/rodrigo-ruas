"use client"

import { BtnForm } from "@/components/BtnForm"
import { Airplane, Info, Infinity as InfinityIcon, Plus } from "@phosphor-icons/react"
import { airportCity } from "@/lib/airports"

interface PricingTicketProps {
  titulo:                 string
  tipo?:                  string
  tagline?:               string
  /* rota */
  codPartida?:            string   // GRU
  codDestino?:            string   // CAI
  destino:                string   // nome do pacote (ex: "Egito")
  dataIda?:               string   // ISO "2026-09-09"
  dataVolta?:             string   // ISO
  dias?:                  number
  vagas?:                 number
  aereoIncluso?:          boolean  // false → mostra "aéreo por conta do viajante"
  /* investimento */
  moeda?:                 string   // "US$" | "R$"
  entrada?:               number
  numParcelas?:           number
  valorParcela?:          number
  /* termos */
  seguroValor?:           string
  seguroStatus?:          string
  politicaCancelamento?:  string
  politicaReagendamento?: string
  /* rodapé */
  rodapeAtendimento?:     string
  rodapeSeguranca?:       string
  incluso?:               string[]
}

const CANCEL: Record<string, { label: string; cls: string }> = {
  "nao-reembolsavel": { label: "Não reembolsável", cls: "text-destructive" },
  "50-reembolsavel":  { label: "50% de reembolso",  cls: "text-warning"     },
  "reembolsavel":     { label: "Reembolso total",   cls: "text-success"     },
}

/* cores locais do ticket */
const NAVY   = "#0D1F30"
const MUTED  = "#7090A0"
const BODY   = "#3D5A6E"
const AMBER  = "#F59E0B"
const GREEN  = "#16A34A"

const nf = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })

function fmtDate(iso?: string): string {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return y && m && d ? `${d}.${m}.${y}` : iso
}

function diffDays(ida?: string, volta?: string): number | null {
  if (!ida || !volta) return null
  const a = Date.parse(ida), b = Date.parse(volta)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  const d = Math.round((b - a) / 86_400_000)
  return d > 0 ? d : null
}

/* ── linha da rota (ida ✈ volta) ─────────────────────── */
function RouteLine({ dias }: { dias?: number | null }) {
  return (
    <div className="w-full md:flex-1 flex flex-col items-center gap-1.5 px-2 py-1 md:py-0">
      <div className="flex items-center w-full">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AMBER }} />
        <div className="flex-1 border-t-2 border-dashed mx-1.5" style={{ borderColor: "#CBD5E1" }} />
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: NAVY }}>
          <Airplane size={16} weight="fill" className="text-white" />
        </div>
        <div className="flex-1 border-t-2 border-dashed mx-1.5" style={{ borderColor: "#CBD5E1" }} />
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: AMBER }} />
      </div>
      {dias && <p className="text-[16px] whitespace-nowrap" style={{ color: MUTED }}>{dias} dias de duração</p>}
    </div>
  )
}

/* ── item da lista de incluso ────────────────────────── */
function InclusoItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src="/icons/check-circle.svg" alt="" width={20} height={20} className="shrink-0" />
      <p className="text-[17px] !text-white/90 leading-snug">{text}</p>
    </div>
  )
}

export function PricingTicket(props: PricingTicketProps) {
  const {
    titulo, tipo, tagline, codPartida, codDestino, destino,
    dataIda, dataVolta, dias, vagas, seguroValor,
    entrada, numParcelas, valorParcela, politicaCancelamento,
  } = props
  /* Sanity retorna null p/ campos vazios — `??` cobre null E undefined (default de parâmetro só cobre undefined) */
  const aereoIncluso          = props.aereoIncluso ?? false
  const moeda                 = props.moeda ?? "US$"
  const seguroStatus          = props.seguroStatus ?? "Incluso"
  const politicaReagendamento = props.politicaReagendamento ?? "R$ 500,00"
  const rodapeAtendimento     = props.rodapeAtendimento ?? "Fale direto com nosso atendimento"
  const rodapeSeguranca       = props.rodapeSeguranca ?? "Compra segura"
  const incluso               = props.incluso ?? []

  const cancelInfo   = CANCEL[politicaCancelamento ?? ""] ?? CANCEL["nao-reembolsavel"]
  const cidadeIda    = airportCity(codPartida) || "São Paulo"
  const totalDias    = diffDays(dataIda, dataVolta) ?? dias ?? null
  const hasParcelas  = !!(numParcelas && valorParcela)
  const tag          = tagline?.trim() || "Eternize esse momento da melhor maneira"
  const seguroIncluso = /inclu/i.test(seguroStatus) && !/n[ãa]o/i.test(seguroStatus)

  return (
    <div className="rounded-[32px] p-4 md:p-5 shadow-2xl" style={{ background: NAVY }} data-cursor-theme="dark">
      <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-0">

        {/* ══ COLUNA ESQUERDA ══════════════════════════════ */}
        <div className="flex-1 min-w-0 flex flex-col gap-5 md:pr-6">

          {/* card branco — rota */}
          <div className="rounded-[20px] bg-white px-6 py-6 md:px-8 md:py-7">
            {/* badge tagline */}
            <div data-cms="tagline" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 mb-6"
                 style={{ borderColor: "rgba(13,31,48,0.18)" }}>
              <InfinityIcon size={16} weight="bold" style={{ color: NAVY }} />
              <span className="text-[15px]" style={{ color: BODY }}>{tag}</span>
            </div>

            {/* rota — vertical no mobile, horizontal no desktop */}
            <div data-cms="rota" className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              {/* origem */}
              <div className="min-w-0 md:shrink-0">
                <p className="text-[26px] md:text-[30px] font-black leading-tight" style={{ color: NAVY }}>
                  {cidadeIda}{codPartida && <span>, ({codPartida})</span>}
                </p>
                {dataIda && <p className="text-[16px] mt-1" style={{ color: MUTED }}>{fmtDate(dataIda)}</p>}
              </div>

              <RouteLine dias={totalDias} />

              {/* destino */}
              <div className="min-w-0 md:shrink-0 md:text-right">
                <p className="text-[26px] md:text-[30px] font-black leading-tight" style={{ color: NAVY }}>
                  {destino}{codDestino && <span>, ({codDestino})</span>}
                </p>
                {dataVolta && <p className="text-[16px] mt-1" style={{ color: MUTED }}>{fmtDate(dataVolta)}</p>}
              </div>
            </div>

            {/* nota */}
            <div className="border-t mt-6 pt-4 flex flex-col gap-3" style={{ borderColor: "#F1F5F9" }}>
              {!aereoIncluso && (
                <span className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[13px] font-semibold"
                      style={{ background: "#FFF3E6", color: "#A06020" }}>
                  <Airplane size={13} weight="fill" /> Roteiro terrestre — aéreo por conta do viajante
                </span>
              )}
              <p className="text-[16px] flex gap-2" style={{ color: MUTED }}>
                <span style={{ color: MUTED }}>•</span>
                <span>Grupo de {vagas ?? 30} pessoas. Atendimento direto com Rodrigo.{" "}
                  <span className="font-semibold" style={{ color: NAVY }}>Vagas limitadas.</span>
                </span>
              </p>
            </div>
          </div>

          {/* incluso — sobre o navy */}
          {incluso.length > 0 && (
            <div data-cms="incluso" className="px-2 md:px-1">
              <h3 className="text-[24px] md:text-[28px] font-bold !text-white mb-5">O que está incluso:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
                {incluso.map((item, i) => <InclusoItem key={i} text={item} />)}
              </div>
            </div>
          )}
        </div>

        {/* ══ PERFURAÇÃO ═══════════════════════════════════ */}
        <div className="relative hidden md:flex flex-col items-center px-1 self-stretch">
          <div className="w-4 h-4 rounded-full -mt-2" style={{ background: "rgba(0,0,0,0.35)" }} />
          <div className="flex-1 border-l-2 border-dashed my-1" style={{ borderColor: "rgba(255,255,255,0.22)" }} />
          <div className="w-4 h-4 rounded-full -mb-2" style={{ background: "rgba(0,0,0,0.35)" }} />
        </div>

        {/* ══ COLUNA DIREITA — INVESTIMENTO ════════════════ */}
        <div className="w-full md:w-[424px] shrink-0 md:pl-6">
          <div className="rounded-[20px] bg-white px-6 py-6 md:px-7 md:py-7 h-full flex flex-col">
            <p className="text-[24px] font-bold mb-4" style={{ color: NAVY }}>Investimento:</p>

            {/* preço */}
            <div data-cms="investimento" className="border-t pt-4" style={{ borderColor: "#F1F5F9" }}>
              {entrada != null && (
                <div className="flex flex-col items-center gap-2 md:flex-row md:flex-nowrap md:items-center md:gap-x-1.5 md:gap-y-0">
                  <span className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-[15px] font-semibold" style={{ color: NAVY }}>{moeda}</span>
                    <span className="text-[31px] font-black leading-none" style={{ color: NAVY }}>{nf(entrada)}</span>
                    <span className="text-[14px]" style={{ color: MUTED }}>(Entrada)</span>
                  </span>
                  {hasParcelas && (
                    <>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#EEF2F6" }}>
                        <Plus size={13} weight="bold" style={{ color: NAVY }} />
                      </span>
                      <span className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-[15px] font-semibold" style={{ color: NAVY }}>{numParcelas}x {moeda}</span>
                        <span className="text-[31px] font-black leading-none" style={{ color: NAVY }}>{nf(valorParcela!)}</span>
                      </span>
                    </>
                  )}
                </div>
              )}
              <p className="text-[14px] italic text-right mt-3" style={{ color: MUTED }}>Valor por pessoa*</p>
            </div>

            {/* termos */}
            <div data-cms="termos" className="rounded-2xl border mt-5 overflow-hidden" style={{ borderColor: "#E9EEF3" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <Info size={16} weight="bold" style={{ color: NAVY }} />
                <p className="text-[15px] font-semibold underline" style={{ color: NAVY }}>Termos e condições do pacote</p>
              </div>
              <div className="px-4 py-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] flex items-center gap-2" style={{ color: BODY }}>
                    <span style={{ color: MUTED }}>●</span> Seguro viagem
                  </span>
                  <span className="text-[15px] flex items-center gap-2">
                    {seguroValor && <span className="line-through" style={{ color: "#94A3B8" }}>{seguroValor}</span>}
                    <span className="font-semibold" style={{ color: seguroIncluso ? GREEN : "#94A3B8" }}>{seguroStatus}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] flex items-center gap-2" style={{ color: BODY }}>
                    <span style={{ color: MUTED }}>●</span> Cancelamento
                  </span>
                  <span className={`text-[15px] font-semibold ${cancelInfo.cls}`}>{cancelInfo.label}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] flex items-center gap-2" style={{ color: BODY }}>
                    <span style={{ color: MUTED }}>●</span> Taxa de reagendamento
                  </span>
                  <span className="text-[15px]" style={{ color: MUTED }}>{politicaReagendamento}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5">
              <BtnForm pacote={titulo} tipo={tipo} className="w-full justify-center">Fechar pacote</BtnForm>
            </div>

            {/* rodapé */}
            <div data-cms="rodape" className="flex flex-col items-center gap-2 mt-4">
              <p className="text-[14px] flex items-center gap-2" style={{ color: MUTED }}>
                <img src="/icons/phone.svg" alt="" width={15} height={15} /> {rodapeAtendimento}
              </p>
              <p className="text-[14px] flex items-center gap-2" style={{ color: MUTED }}>
                <img src="/icons/lock.svg" alt="" width={14} height={15} /> {rodapeSeguranca}
              </p>
            </div>
          </div>
        </div>

        {/* perfuração mobile (horizontal, no fim) */}
        <div className="md:hidden flex items-center px-2 pt-1">
          <div className="w-4 h-4 rounded-full -ml-2" style={{ background: "rgba(0,0,0,0.35)" }} />
          <div className="flex-1 border-t-2 border-dashed mx-1" style={{ borderColor: "rgba(255,255,255,0.22)" }} />
          <div className="w-4 h-4 rounded-full -mr-2" style={{ background: "rgba(0,0,0,0.35)" }} />
        </div>

      </div>
    </div>
  )
}
