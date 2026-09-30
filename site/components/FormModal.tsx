"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { X, CheckCircle, WarningCircle, ArrowLeft, Check } from "@phosphor-icons/react"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { urlFor } from "@/sanity/lib/image"

/* ── Types ─────────────────────────────────────────────────── */
interface Programa { valor: string; titulo: string; descricao?: string }
interface Destino  { titulo: string; slug: string; badge?: string; periodo?: string }

interface Campo {
  tipo: "input" | "email" | "phone" | "textarea" | "select" | "programa-destino"
  label: string
  nome: string
  placeholder?: string
  obrigatorio?: boolean
  opcoes?: string[]
  programas?: Programa[]
}

interface FormConfig {
  titulo:            string
  descricao?:        string
  webhookUrl:        string
  redirectAoEnviar?: string
  mensagemSucesso:   string
  textoBotao:        string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imagemDestaque?:   any
  campos:            Campo[]
}

interface FormModalProps {
  config:  FormConfig
  isOpen:  boolean
  onClose: () => void
  pacote?: string   /* título do pacote — pré-marca destino no step 3 */
  tipo?:   string   /* gruposDoRuas | assinadoByRuas */
}

/* ── Constantes ─────────────────────────────────────────────── */
const PROGRAMAS: Programa[] = [
  {
    valor:    "gruposDoRuas",
    titulo:   "Grupo do Ruas",
    descricao:"Rodrigo vai junto. Curadoria e presença pessoal do início ao fim.",
  },
  {
    valor:    "assinadoByRuas",
    titulo:   "Pacotes Assinados",
    descricao:"Roteiro e hotéis curados por Rodrigo. Privativo — sai quando você quiser.",
  },
]

const STEP_LABELS = ["Seus dados", "Programa", "Destino"]

function isPhoneCampo(campo: Campo): boolean {
  return campo.tipo === "phone" || /telefone|whatsapp|celular|phone|fone/i.test(campo.nome)
}

/* ── Componente principal ───────────────────────────────────── */
export function FormModal({ config, isOpen, onClose, pacote, tipo }: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const drawerRef  = useRef<HTMLDivElement>(null)

  /* ── Steps ─────────────────────────────────────────────────── */
  const [step, setStep] = useState<1 | 2 | 3>(1)

  /* ── Step 1: dados pessoais ─────────────────────────────────── */
  /* Remove campos já cobertos pelos steps 2 e 3 */
  const personalCampos = config.campos.filter(c =>
    c.tipo !== "programa-destino" &&
    c.nome !== "destino" &&
    c.nome !== "destino_programa"
  )
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  /* ── Step 2: programa ───────────────────────────────────────── */
  const programas: Programa[] =
    config.campos.find(c => c.tipo === "programa-destino")?.programas ?? PROGRAMAS
  const [programa, setPrograma] = useState<string>("")
  const [progError, setProgError] = useState(false)

  /* ── Step 3: destinos (checkbox) ──────────────────────────── */
  const [destinos,        setDestinos]        = useState<Destino[]>([])
  const [loadingDestinos, setLoadingDestinos] = useState(false)
  const [checked,         setChecked]         = useState<Set<string>>(new Set())

  /* ── Submit ─────────────────────────────────────────────────── */
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errMsg, setErrMsg] = useState("")

  /* ─────────────────────────────────────────────────────────────
     PRÉ-PREENCHIMENTO
     – tipo prop  → programa pré-selecionado
     – pacote prop → destino pré-checked no step 3
     – URL ?tipo=  → programa pré-selecionado (fallback sem prop)
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return

    /* 1. Programa via prop */
    if (tipo) {
      setPrograma(tipo)
    } else {
      /* 2. Programa via URL searchParam */
      const urlTipo = new URLSearchParams(window.location.search).get("tipo") ?? ""
      if (urlTipo) setPrograma(urlTipo)
    }

    /* 3. Destino via prop (pré-marca o checkbox) */
    if (pacote) {
      setChecked(new Set([pacote]))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* Carrega destinos quando programa muda */
  useEffect(() => {
    if (!programa) { setDestinos([]); return }
    setLoadingDestinos(true)
    fetch(`/api/destinos?tipo=${programa}`)
      .then(r => r.json())
      .then((data: Destino[]) => setDestinos(data.filter(d => d.titulo)))
      .catch(() => setDestinos([]))
      .finally(() => setLoadingDestinos(false))
  }, [programa])

  /* ── GSAP: abrir/fechar drawer ─────────────────────────────── */
  useEffect(() => {
    const overlay = overlayRef.current
    const drawer  = drawerRef.current
    if (!overlay || !drawer) return

    if (isOpen) {
      const scrollW = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollW}px`
      document.body.style.overflow = "hidden"
      gsap.set(overlay, { display: "block" })
      gsap.set(drawer,  { x: "100%" })
      gsap.to(overlay, { opacity: 1, duration: 0.5,  ease: "power2.inOut" })
      gsap.to(drawer,  { x: "0%",   duration: 0.8,  ease: "power3.inOut" })
    } else {
      gsap.to(drawer,  { x: "100%", duration: 0.6, ease: "power3.inOut" })
      gsap.to(overlay, {
        opacity: 0, duration: 0.6, ease: "power2.inOut",
        onComplete: () => {
          gsap.set(overlay, { display: "none" })
          document.body.style.overflow     = ""
          document.body.style.paddingRight = ""
          /* reset */
          setStep(1)
          setValues({})
          setErrors({})
          setPrograma("")
          setChecked(new Set())
          setStatus("idle")
        },
      })
    }
  }, [isOpen])

  /* ── Validações por step ─────────────────────────────────────── */
  function validateStep1() {
    const newErrors: Record<string, string> = {}
    for (const campo of personalCampos) {
      const val = values[campo.nome]?.trim() ?? ""
      if (campo.obrigatorio && !val)
        newErrors[campo.nome] = `${campo.label} é obrigatório`
      const isEmail = campo.tipo === "email" || campo.nome.toLowerCase().includes("email") || campo.nome.toLowerCase().includes("e-mail")
      if (isEmail && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        newErrors[campo.nome] = "E-mail inválido"
      if (isPhoneCampo(campo) && val) {
        /* PhoneInput retorna +DDIXXXXXXXXXX — mínimo 10 dígitos totais */
        const digits = val.replace(/\D/g, "")
        if (digits.length < 10)
          newErrors[campo.nome] = "Número inválido — informe DDD + número"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateStep2() {
    if (!programa) { setProgError(true); return false }
    setProgError(false)
    return true
  }

  /* ── Navegação ────────────────────────────────────────────────── */
  function next() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => (s + 1) as 1 | 2 | 3)
  }

  function back() {
    setStep(s => (s - 1) as 1 | 2 | 3)
  }

  /* ── Submit ──────────────────────────────────────────────────── */
  async function handleSubmit() {
    setStatus("loading")
    try {
      const payload = {
        ...values,
        destino_programa: programa,
        destino: [...checked].join(", ") || "Não especificado",
      }

      const res = await fetch("/api/submit-form", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 422) console.warn("Webhook não configurado no Sanity.")
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setStatus("success")
      if (config.redirectAoEnviar)
        setTimeout(() => { window.location.href = config.redirectAoEnviar! }, 1800)
    } catch (err) {
      console.error("Form submit error:", err)
      setStatus("error")
      setErrMsg("Ocorreu um erro ao enviar. Tente novamente ou fale pelo WhatsApp.")
    }
  }

  /* ── Toggle checkbox ─────────────────────────────────────────── */
  function toggleDestino(titulo: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(titulo) ? next.delete(titulo) : next.add(titulo)
      return next
    })
  }

  /* ── Helpers visuais ─────────────────────────────────────────── */
  const inputBase = `
    w-full bg-white/[0.04] border border-white/10
    rounded-lg px-4 py-3.5 text-[16px] text-white
    placeholder-white/25 focus:outline-none
    focus:border-white/30 transition-colors duration-200
  `

  const programaLabel: Record<string, string> = {
    gruposDoRuas:      "Grupo do Ruas",
    assinadoByRuas:    "Pacotes Assinados",
  }

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-[9990]"
        style={{ display: "none", opacity: 0, background: "rgba(6,15,24,0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Drawer lateral */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-[9991]
                   w-full md:w-[45vw]
                   bg-[#080F16] overflow-y-auto flex flex-col"
        style={{ transform: "translateX(100%)", msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-center gap-4">
            {/* Botão Voltar (steps 2 e 3) */}
            {step > 1 && status !== "success" && (
              <button
                onClick={back}
                className="flex items-center gap-1.5 text-[13px] font-semibold
                           tracking-[0.08em] uppercase text-white/40 hover:text-white/80
                           transition-colors"
              >
                <ArrowLeft size={14} weight="bold" /> Voltar
              </button>
            )}
            {/* Step indicator */}
            {status !== "success" && (
              <div className="flex items-center gap-2">
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1
                  const active  = n === step
                  const done    = n < step
                  return (
                    <div key={n} className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 transition-all duration-300
                        ${active ? "opacity-100" : done ? "opacity-60" : "opacity-25"}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center
                          text-[10px] font-bold shrink-0 transition-colors
                          ${active ? "bg-white text-[#080F16]" : done ? "bg-white/20 text-white" : "bg-white/10 text-white/50"}`}>
                          {done ? <Check size={10} weight="bold" /> : n}
                        </span>
                        <span className={`text-[11px] font-semibold tracking-[0.1em] uppercase hidden sm:block
                          ${active ? "text-white" : "text-white/40"}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`w-4 h-px transition-colors ${done ? "bg-white/40" : "bg-white/10"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50
                       hover:text-white transition-colors flex items-center gap-2"
          >
            FECHAR <X size={14} weight="bold" />
          </button>
        </div>

        {/* ── Intro: título + imagem (só no step 1) ─────────────── */}
        {step === 1 && status !== "success" && (
          <div className="px-8 pb-6 grid grid-cols-[1fr_auto] gap-6 items-start shrink-0">
            <div>
              <h2 className="text-[22px] font-bold text-white leading-snug mb-3">
                {config.titulo}
              </h2>
              {config.descricao && (
                <p className="text-[14px] text-white/50 leading-relaxed">
                  {config.descricao}
                </p>
              )}
            </div>
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/8">
              <img
                src={
                  config.imagemDestaque
                    ? urlFor(config.imagemDestaque).width(200).height(200).fit("crop").url()
                    : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&q=80&fm=webp&fit=crop"
                }
                alt={config.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Título de etapa (steps 2 e 3) */}
        {step === 2 && status !== "success" && (
          <div className="px-8 pb-6 shrink-0">
            <h2 className="text-[22px] font-bold text-white leading-snug">
              Qual programa te interessa?
            </h2>
            <p className="text-[14px] text-white/50 mt-1">
              Escolha o formato de viagem ideal pra você.
            </p>
          </div>
        )}
        {step === 3 && status !== "success" && (
          <div className="px-8 pb-6 shrink-0">
            <h2 className="text-[22px] font-bold text-white leading-snug">
              Qual destino você tem em mente?
            </h2>
            <p className="text-[14px] text-white/50 mt-1">
              Selecione um ou mais destinos — pode ser mais de um.
            </p>
            {programa && (
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full
                               bg-white/8 border border-white/12 text-[12px] font-semibold
                               text-white/60 tracking-wide">
                {programaLabel[programa] ?? programa}
              </span>
            )}
          </div>
        )}

        {/* Divisor */}
        {status !== "success" && (
          <div className="px-8 shrink-0">
            <div className="border-t border-white/10 mb-6" />
          </div>
        )}

        {/* ── Conteúdo central ──────────────────────────────────── */}
        <div className="flex-1 px-8 pb-8 flex flex-col">

          {/* SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <CheckCircle size={56} weight="fill" className="text-success" />
              <p className="text-[20px] font-bold text-white leading-snug">
                {config.mensagemSucesso}
              </p>
              <p className="text-[14px] text-white/40">
                Entraremos em contato em breve.
              </p>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP 1 — Dados pessoais
          ════════════════════════════════════════ */}
          {status !== "success" && step === 1 && (
            <div className="flex flex-col gap-5 flex-1">
              {personalCampos.map(campo => (
                <div key={campo.nome} className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-white/60 tracking-wide">
                    {campo.label}
                    {campo.obrigatorio && <span className="text-warning/80 ml-1">*</span>}
                  </label>

                  {campo.tipo === "textarea" && (
                    <textarea
                      placeholder={campo.placeholder}
                      rows={3}
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={`${inputBase} resize-none`}
                    />
                  )}

                  {campo.tipo === "select" && (
                    <select
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={`${inputBase} cursor-pointer`}
                      style={{ appearance: "none" }}
                    >
                      <option value="" style={{ color: "#0D1F30", background: "#fff" }}>Selecione...</option>
                      {campo.opcoes?.map(op => (
                        <option key={op} value={op} style={{ color: "#0D1F30", background: "#fff" }}>{op}</option>
                      ))}
                    </select>
                  )}

                  {/* Phone: react-international-phone */}
                  {isPhoneCampo(campo) && (
                    <PhoneInput
                      defaultCountry="br"
                      value={values[campo.nome] ?? ""}
                      onChange={phone => setValues(v => ({ ...v, [campo.nome]: phone }))}
                      style={{ width: "100%" }}
                      inputStyle={{
                        flex: 1,
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderLeft: "none",
                        borderRadius: "0 8px 8px 0",
                        color: "white",
                        fontSize: "16px",
                        padding: "14px 16px",
                        outline: "none",
                      }}
                      countrySelectorStyleProps={{
                        buttonStyle: {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRight: "none",
                          borderRadius: "8px 0 0 8px",
                          padding: "0 12px",
                          height: "100%",
                        },
                        dropdownStyleProps: {
                          style: {
                            background: "#0D1A26",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "8px",
                            color: "white",
                            zIndex: 9999,
                          },
                        },
                      }}
                    />
                  )}

                  {/* Outros tipos (text, email, input) */}
                  {!["textarea", "select"].includes(campo.tipo) && !isPhoneCampo(campo) && (
                    <input
                      type={campo.tipo === "email" || campo.nome.toLowerCase().includes("email") ? "email" : "text"}
                      placeholder={campo.placeholder}
                      value={values[campo.nome] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [campo.nome]: e.target.value }))}
                      className={inputBase}
                    />
                  )}

                  {errors[campo.nome] && (
                    <p className="text-[12px] text-destructive flex items-center gap-1.5">
                      <WarningCircle size={13} weight="fill" />
                      {errors[campo.nome]}
                    </p>
                  )}
                </div>
              ))}

              {/* Rodapé step 1 */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/8">
                <p className="text-[12px] text-white/25">Seus dados não são compartilhados.</p>
                <StepBtn onClick={next} label="Próximo" />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP 2 — Programa
          ════════════════════════════════════════ */}
          {status !== "success" && step === 2 && (
            <div className="flex flex-col gap-4 flex-1">
              {programas.map(p => {
                const isSelected = programa === p.valor
                return (
                  <button
                    key={p.valor}
                    type="button"
                    onClick={() => { setPrograma(p.valor); setProgError(false) }}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? "border-white bg-white/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[16px] font-bold text-white leading-snug">{p.titulo}</p>
                        {p.descricao && (
                          <p className="text-[13px] text-white/50 mt-1.5 leading-relaxed">{p.descricao}</p>
                        )}
                      </div>
                      {/* Check indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center
                        transition-all duration-200
                        ${isSelected ? "bg-white border-white" : "border-white/20"}`}>
                        {isSelected && <Check size={11} weight="bold" className="text-[#080F16]" />}
                      </div>
                    </div>
                  </button>
                )
              })}

              {progError && (
                <p className="text-[12px] text-destructive flex items-center gap-1.5">
                  <WarningCircle size={13} weight="fill" /> Selecione um programa para continuar
                </p>
              )}

              <div className="mt-auto pt-6 flex justify-end border-t border-white/8">
                <StepBtn onClick={next} label="Ver destinos" />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP 3 — Destinos (checkboxes)
          ════════════════════════════════════════ */}
          {status !== "success" && step === 3 && (
            <div className="flex flex-col gap-3 flex-1">
              {loadingDestinos && (
                <div className="flex items-center gap-3 text-white/40 text-[14px] py-8">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  Carregando destinos disponíveis...
                </div>
              )}

              {!loadingDestinos && destinos.length === 0 && (
                <p className="text-[14px] text-white/40 py-8 text-center">
                  Nenhum destino cadastrado para este programa no momento.
                </p>
              )}

              {!loadingDestinos && destinos.map(d => {
                const isChecked  = checked.has(d.titulo)
                const isEsgotado = d.badge === "esgotado"
                return (
                  <button
                    key={d.slug}
                    type="button"
                    disabled={isEsgotado}
                    onClick={() => !isEsgotado && toggleDestino(d.titulo)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200
                      flex items-center gap-4
                      ${isEsgotado ? "opacity-35 cursor-not-allowed border-white/8 bg-white/[0.02]" :
                        isChecked  ? "border-white/50 bg-white/10 cursor-pointer" :
                                     "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] cursor-pointer"
                      }`}
                  >
                    {/* Checkbox visual */}
                    <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-all duration-200
                      ${isChecked ? "bg-white border-white" : "border-white/25"}`}>
                      {isChecked && <Check size={11} weight="bold" className="text-[#080F16]" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-semibold leading-snug
                        ${isChecked ? "text-white" : "text-white/80"}`}>
                        {d.titulo}
                        {isEsgotado && (
                          <span className="ml-2 text-[11px] font-bold uppercase tracking-wide
                                           text-white/30">Esgotado</span>
                        )}
                      </p>
                      {d.periodo && (
                        <p className="text-[12px] text-white/40 mt-0.5">{d.periodo}</p>
                      )}
                    </div>

                    {/* Badge vagas */}
                    {d.badge === "vagas" && !isEsgotado && (
                      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide
                                       px-2 py-0.5 rounded-full bg-warning/15 text-warning">
                        Últimas vagas
                      </span>
                    )}
                  </button>
                )
              })}

              {/* Opção "Ainda não decidi" */}
              {!loadingDestinos && destinos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setChecked(new Set())}
                  className="w-full text-left px-4 py-3 rounded-lg border border-dashed
                             border-white/10 text-[13px] text-white/35
                             hover:border-white/20 hover:text-white/50 transition-all duration-200"
                >
                  Ainda não decidi — quero saber mais opções
                </button>
              )}

              {status === "error" && (
                <p className="text-[13px] text-destructive bg-destructive/10 rounded-lg px-4 py-3
                               border border-destructive/20 mt-2">
                  {errMsg}
                </p>
              )}

              {/* Rodapé step 3 */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/8">
                <p className="text-[12px] text-white/25">
                  {checked.size > 0
                    ? `${checked.size} destino${checked.size > 1 ? "s" : ""} selecionado${checked.size > 1 ? "s" : ""}`
                    : "Seleção opcional"}
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="flex items-center gap-3 bg-white text-[#080F16]
                             text-[15px] font-bold px-6 py-3 rounded-full
                             hover:bg-gray-200 active:bg-gray-300
                             transition-colors duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading"
                    ? <span className="w-4 h-4 border-2 border-[#080F16]/30 border-t-[#080F16] rounded-full animate-spin" />
                    : <>{config.textoBotao} →</>
                  }
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

/* ── Botão "Próximo" reutilizável ───────────────────────────── */
function StepBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-white text-[#080F16]
                 text-[15px] font-bold px-6 py-3 rounded-full
                 hover:bg-gray-200 active:bg-gray-300
                 transition-colors duration-200"
    >
      {label} →
    </button>
  )
}
