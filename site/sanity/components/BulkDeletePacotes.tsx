"use client"

/* Seleção em massa de pacotes para PUBLICAR ou EXCLUIR — evita ter que abrir
   pacote por pacote. Abre como janela por cima do Studio, pelo menu "..." da lista de
   Pacotes (ver BulkDeleteHost). Mesmo vocabulário visual do GuiaDoc.
   Publicar: confirmação simples. Excluir: diálogo de revisão onde é preciso
   digitar "deletar" para liberar o botão. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useClient, type LayoutProps } from "sanity"
import { createImageUrlBuilder } from "@sanity/image-url"
import { Trash, MagnifyingGlass, Warning, CheckCircle, X, UploadSimple } from "@phosphor-icons/react/dist/ssr"
import { PACOTE_SORTS, TIPO_LABEL, CONTINENTE_LABEL } from "../schemaTypes/pacote"

/* paleta do ticket (igual GuiaDoc) */
const NAVY   = "#0D1F30"
const BODY   = "#3D5A6E"
const MUTED  = "#7090A0"
const DASH   = "#E2E8F0"
const BOXBG  = "#F5F7F9"
const BOXBD  = "#E9EEF3"
const DANGER = "#B42318"
const OK     = "#1A8A48"
const FONT   = '"DM Sans", system-ui, -apple-system, sans-serif'

const CONFIRM_WORD = "deletar"

type Raw = {
  _id: string
  titulo?: string
  tipo?: string
  continentes?: string[]
  dataIda?: string
  periodo?: string
  heroImage?: unknown
}

type Pacote = {
  id: string          // id base (sem drafts./versions.)
  docIds: string[]    // todos os documentos (publicado, rascunho, versões)
  titulo: string
  tipo?: string
  continentes: string[]
  dataIda?: string
  periodo?: string
  heroImage?: unknown
  publicado: boolean
  rascunho: boolean
}

type SortKey = (typeof PACOTE_SORTS)[number]["name"]

const baseId = (id: string) => id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "")

function agrupa(raws: Raw[]): Pacote[] {
  const map = new Map<string, Pacote>()
  for (const r of raws) {
    const id = baseId(r._id)
    const isPublished = r._id === id
    const cur = map.get(id)
    if (!cur) {
      map.set(id, {
        id, docIds: [r._id],
        titulo: r.titulo || "(sem nome)", tipo: r.tipo, continentes: r.continentes ?? [],
        dataIda: r.dataIda, periodo: r.periodo, heroImage: r.heroImage,
        publicado: isPublished, rascunho: !isPublished,
      })
      continue
    }
    cur.docIds.push(r._id)
    cur.publicado ||= isPublished
    cur.rascunho ||= !isPublished
    /* rascunho é a versão mais recente — prevalece na exibição */
    if (!isPublished) {
      cur.titulo = r.titulo || cur.titulo
      cur.tipo = r.tipo ?? cur.tipo
      cur.continentes = r.continentes ?? cur.continentes
      cur.dataIda = r.dataIda ?? cur.dataIda
      cur.periodo = r.periodo ?? cur.periodo
      cur.heroImage = r.heroImage ?? cur.heroImage
    }
  }
  return [...map.values()]
}

const TIPO_ORDEM = Object.keys(TIPO_LABEL)

function ordena(list: Pacote[], key: SortKey): Pacote[] {
  const nome = (a: Pacote, b: Pacote) => a.titulo.localeCompare(b.titulo, "pt-BR")
  const vazioPorUltimo = (a?: string, b?: string) =>
    a && b ? a.localeCompare(b, "pt-BR") : a ? -1 : b ? 1 : 0
  return [...list].sort((a, b) => {
    switch (key) {
      case "tipo": {
        const ia = TIPO_ORDEM.indexOf(a.tipo ?? ""), ib = TIPO_ORDEM.indexOf(b.tipo ?? "")
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || nome(a, b)
      }
      case "data":
        return vazioPorUltimo(a.dataIda, b.dataIda) || nome(a, b)
      case "continente":
        return vazioPorUltimo(contLabel(a), contLabel(b)) || nome(a, b)
      default:
        return nome(a, b)
    }
  })
}

const contLabel = (p: Pacote) =>
  p.continentes.map((c) => CONTINENTE_LABEL[c] ?? c).join(", ") || undefined

const fmtData = (iso?: string) => {
  if (!iso) return undefined
  const [y, m, d] = iso.split("-")
  return d && m && y ? `${d}/${m}/${y}` : iso
}

/* checkbox grande (público 60+) */
function Check({ checked, indeterminate, onChange, label }: {
  checked: boolean; indeterminate?: boolean; onChange: (e: React.MouseEvent) => void; label: string
}) {
  const on = checked || indeterminate
  return (
    <button
      type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : checked} aria-label={label}
      onClick={(e) => { e.stopPropagation(); onChange(e) }}
      style={{
        width: 24, height: 24, flexShrink: 0, borderRadius: 6, cursor: "pointer", padding: 0,
        border: `2px solid ${on ? NAVY : "#B8C4CE"}`, background: on ? NAVY : "#fff",
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 700, lineHeight: 1,
      }}
    >
      {indeterminate ? "–" : checked ? "✓" : ""}
    </button>
  )
}

const pill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer",
  fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "12px 22px", borderRadius: 999,
  border: `1.5px solid ${NAVY}`, background: "#fff", color: NAVY,
}
const dot = (bg: string) => <span style={{ width: 7, height: 7, borderRadius: 999, background: bg }} />

/* evento disparado pelo item do menu "..." da lista de Pacotes */
export const ABRIR_EXCLUSAO_EM_MASSA = "rr:excluir-pacotes-em-massa"

/* Layout do Studio: renderiza o Studio normal + a janela, que abre ao
   receber o evento. Fica dentro do Studio, então useClient funciona. */
export function BulkDeleteHost(props: LayoutProps) {
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const abrir = () => setAberto(true)
    window.addEventListener(ABRIR_EXCLUSAO_EM_MASSA, abrir)
    return () => window.removeEventListener(ABRIR_EXCLUSAO_EM_MASSA, abrir)
  }, [])
  return (
    <>
      {props.renderDefault(props)}
      {aberto && (
        <div
          onClick={() => setAberto(false)}
          style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(13,31,48,.45)", display: "flex", justifyContent: "center", padding: "24px 16px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 980, height: "100%", overflowY: "auto", borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}
          >
            <BulkDeletePacotes onClose={() => setAberto(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export function BulkDeletePacotes({ onClose }: { onClose: () => void }) {
  const client = useClient({ apiVersion: "2024-01-01" })
  const imgBuilder = useMemo(() => createImageUrlBuilder(client), [client])

  const [pacotes, setPacotes] = useState<Pacote[] | null>(null)
  const [erroCarga, setErroCarga] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [sort, setSort] = useState<SortKey>("tipo")
  const [sel, setSel] = useState<Set<string>>(new Set())
  const lastClicked = useRef<number | null>(null)

  const [dialogo, setDialogo] = useState<null | "excluir" | "publicar">(null)
  const [aPublicar, setAPublicar] = useState<Pacote[]>([])
  const [digitado, setDigitado] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [erroAcao, setErroAcao] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try {
      const raws = await client.fetch<Raw[]>(
        `*[_type == "pacote"]{ _id, titulo, tipo, continentes, dataIda, periodo, heroImage }`,
        {},
        { perspective: "raw" },
      )
      const lista = agrupa(raws)
      setPacotes(lista)
      /* remove da seleção o que não existe mais */
      setSel((s) => new Set([...s].filter((id) => lista.some((p) => p.id === id))))
      setErroCarga(null)
    } catch (e) {
      setErroCarga(e instanceof Error ? e.message : String(e))
    }
  }, [client])

  /* carga inicial + atualiza sozinho quando alguém cria/edita/apaga */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined = setTimeout(carregar, 0)
    const sub = client
      .listen(`*[_type == "pacote"]`, {}, { includeResult: false, visibility: "query" })
      .subscribe(() => { clearTimeout(t); t = setTimeout(carregar, 600) })
    return () => { clearTimeout(t); sub.unsubscribe() }
  }, [client, carregar])

  const visiveis = useMemo(() => {
    if (!pacotes) return []
    const q = busca.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    const filtrados = q
      ? pacotes.filter((p) =>
          [p.titulo, contLabel(p), TIPO_LABEL[p.tipo ?? ""]]
            .join(" ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q))
      : pacotes
    return ordena(filtrados, sort)
  }, [pacotes, busca, sort])

  const selecionados = useMemo(() => (pacotes ?? []).filter((p) => sel.has(p.id)), [pacotes, sel])
  const visSel = visiveis.filter((p) => sel.has(p.id)).length
  const todosVis = visiveis.length > 0 && visSel === visiveis.length

  const toggle = (idx: number, shift: boolean) => {
    const alvo = visiveis[idx]
    const marcar = !sel.has(alvo.id)
    const next = new Set(sel)
    /* shift+clique marca/desmarca o intervalo inteiro */
    const [a, b] = shift && lastClicked.current !== null
      ? [Math.min(lastClicked.current, idx), Math.max(lastClicked.current, idx)]
      : [idx, idx]
    for (let i = a; i <= b; i++) {
      if (marcar) next.add(visiveis[i].id)
      else next.delete(visiveis[i].id)
    }
    lastClicked.current = idx
    setSel(next)
    setSucesso(null)
  }

  const toggleTodos = () => {
    const next = new Set(sel)
    visiveis.forEach((p) => (todosVis ? next.delete(p.id) : next.add(p.id)))
    setSel(next)
    setSucesso(null)
  }

  /* só dá para publicar quem tem rascunho (drafts.<id>) */
  const temRascunho = (p: Pacote) => p.docIds.includes(`drafts.${p.id}`)
  const comAlteracoes = useMemo(() => (pacotes ?? []).filter(temRascunho), [pacotes])
  const selecionadosPublicaveis = selecionados.filter(temRascunho)

  const abrirExcluir = () => { setDigitado(""); setErroAcao(null); setDialogo("excluir") }
  const abrirPublicar = (lista: Pacote[]) => { setAPublicar(lista); setErroAcao(null); setDialogo("publicar") }
  const fecharDialogo = () => { if (!ocupado) setDialogo(null) }
  const publicando = dialogo === "publicar"
  const listaDialogo = publicando ? aPublicar : selecionados
  /* ao publicar a partir da seleção, avisa quantos não tinham o que publicar */
  const ignorados = publicando && sel.size > 0 ? selecionados.length - aPublicar.length : 0
  const confirmado = digitado.trim().toLowerCase() === CONFIRM_WORD

  const excluir = async () => {
    if (!confirmado || ocupado || selecionados.length === 0) return
    setOcupado(true)
    setErroAcao(null)
    try {
      const tx = client.transaction()
      selecionados.flatMap((p) => p.docIds).forEach((id) => tx.delete(id))
      await tx.commit({ visibility: "async" })
      const n = selecionados.length
      setSucesso(
        `${n} ${n === 1 ? "pacote excluído" : "pacotes excluídos"}. ` +
        "Pode levar até 10 minutos para sumir do site.",
      )
      setSel(new Set())
      setDialogo(null)
      carregar()
    } catch (e) {
      setErroAcao(e instanceof Error ? e.message : String(e))
    } finally {
      setOcupado(false)
    }
  }

  /* mesma ação do botão "Publish" do Studio, para vários de uma vez (tudo ou nada) */
  const publicar = async () => {
    if (ocupado || aPublicar.length === 0) return
    setOcupado(true)
    setErroAcao(null)
    try {
      await client.withConfig({ apiVersion: "2025-02-19" }).action(
        aPublicar.map((p) => ({
          actionType: "sanity.action.document.publish" as const,
          draftId: `drafts.${p.id}`,
          publishedId: p.id,
        })),
      )
      const n = aPublicar.length
      setSucesso(
        `${n} ${n === 1 ? "pacote publicado" : "pacotes publicados"}. ` +
        "Pode levar até 10 minutos para aparecer no site.",
      )
      setSel(new Set())
      setDialogo(null)
      carregar()
    } catch (e) {
      setErroAcao(e instanceof Error ? e.message : String(e))
    } finally {
      setOcupado(false)
    }
  }

  /* Esc fecha a confirmação; sem confirmação aberta, fecha a janela */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (dialogo) fecharDialogo()
      else onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  return (
    <div style={{ fontFamily: FONT, color: NAVY, background: BOXBG, minHeight: "100%", padding: "28px 24px 32px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* cabeçalho */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <h1 style={{ flex: 1, fontSize: 26, fontWeight: 700, margin: "0 0 6px" }}>Selecionar pacotes</h1>
          <button type="button" onClick={onClose} style={{ ...pill, padding: "9px 16px" }}>
            <X size={16} weight="bold" /> Fechar
          </button>
        </div>
        <p style={{ fontSize: 16, color: BODY, margin: "0 0 22px", lineHeight: 1.5 }}>
          Marque os pacotes e escolha <strong>Publicar</strong> ou <strong>Excluir</strong> na barra de baixo.
          Dica: segure <strong>Shift</strong> e clique para marcar vários seguidos.
        </p>

        {/* atalho: publicar tudo que tem alteração pendente */}
        {comAlteracoes.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: "#FBF1E4", border: "1px solid #F0DCC0", borderRadius: 12, padding: "12px 12px 12px 16px", marginBottom: 16 }}>
            <span style={{ flex: 1, minWidth: 220, fontSize: 16, color: "#7A4A12", lineHeight: 1.4 }}>
              <strong>{comAlteracoes.length} {comAlteracoes.length === 1 ? "pacote tem" : "pacotes têm"}</strong> alterações que ainda não estão no site.
            </span>
            <button type="button" onClick={() => abrirPublicar(comAlteracoes)} style={{ ...pill, background: OK, borderColor: OK, color: "#fff" }}>
              <UploadSimple size={18} weight="bold" /> Publicar tudo {dot("#fff")}
            </button>
          </div>
        )}

        {sucesso && (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, background: "#EAF6EF", border: "1px solid #BFE3CD", color: OK, borderRadius: 12, padding: "14px 16px", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            <CheckCircle size={22} weight="fill" />
            <span style={{ flex: 1 }}>{sucesso}</span>
            <button type="button" onClick={() => setSucesso(null)} aria-label="Fechar aviso" style={{ border: "none", background: "none", color: OK, cursor: "pointer", padding: 4, display: "flex" }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* card */}
        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BOXBD}`, overflow: "hidden" }}>

          {/* barra: busca + ordenação */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 16, borderBottom: `1px dashed ${DASH}` }}>
            <label style={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${BOXBD}`, borderRadius: 10, padding: "0 12px", background: BOXBG }}>
              <MagnifyingGlass size={18} color={MUTED} />
              <input
                value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, tipo ou continente"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: FONT, fontSize: 16, color: NAVY, padding: "12px 0" }}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: BODY, fontWeight: 500 }}>
              Ordenar por
              <select
                value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                style={{ fontFamily: FONT, fontSize: 16, color: NAVY, fontWeight: 600, border: `1px solid ${BOXBD}`, borderRadius: 10, padding: "11px 12px", background: "#fff", cursor: "pointer" }}
              >
                {PACOTE_SORTS.map((s) => <option key={s.name} value={s.name}>{s.title}</option>)}
              </select>
            </label>
          </div>

          {/* selecionar todos */}
          <div
            onClick={toggleTodos}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: `1px dashed ${DASH}`, cursor: visiveis.length ? "pointer" : "default", fontSize: 15, fontWeight: 600, color: BODY }}
          >
            <Check checked={todosVis} indeterminate={visSel > 0 && !todosVis} onChange={toggleTodos} label="Selecionar todos" />
            <span>
              {todosVis ? "Desmarcar todos" : "Selecionar todos"}
              <span style={{ color: MUTED, fontWeight: 500 }}> · {visiveis.length} {visiveis.length === 1 ? "pacote" : "pacotes"}{busca ? " encontrados" : ""}</span>
            </span>
          </div>

          {/* lista */}
          {erroCarga && <p style={{ padding: 16, color: DANGER, fontSize: 15 }}>Não foi possível carregar os pacotes: {erroCarga}</p>}
          {!pacotes && !erroCarga && <p style={{ padding: 16, color: MUTED, fontSize: 16 }}>Carregando pacotes…</p>}
          {pacotes && visiveis.length === 0 && (
            <p style={{ padding: 16, color: MUTED, fontSize: 16 }}>{busca ? "Nenhum pacote encontrado para essa busca." : "Nenhum pacote cadastrado."}</p>
          )}

          {visiveis.map((p, idx) => {
            const on = sel.has(p.id)
            const thumb = p.heroImage ? imgBuilder.image(p.heroImage).width(128).height(88).fit("crop").auto("format").url() : null
            const data = fmtData(p.dataIda) ?? p.periodo
            return (
              <div
                key={p.id}
                onClick={(e) => toggle(idx, e.shiftKey)}
                onMouseDown={(e) => { if (e.shiftKey) e.preventDefault() /* evita selecionar texto */ }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer",
                  borderBottom: idx < visiveis.length - 1 ? `1px dashed ${DASH}` : "none",
                  background: on ? "#EEF3F8" : "#fff", transition: "background .15s",
                }}
              >
                <Check checked={on} onChange={(e) => toggle(idx, e.shiftKey)} label={`Selecionar ${p.titulo}`} />
                <div style={{ width: 64, height: 44, borderRadius: 8, overflow: "hidden", background: BOXBG, border: `1px solid ${BOXBD}`, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura do Studio, já vem redimensionada do CDN do Sanity */}
                  {thumb && <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: 17, fontWeight: 700 }}>{p.titulo}</strong>
                    {!p.publicado && <Tag cor="#A06020" fundo="#FBF1E4">Rascunho</Tag>}
                    {p.publicado && p.rascunho && <Tag cor={BODY} fundo={BOXBG}>Alterações não publicadas</Tag>}
                  </div>
                  <div style={{ fontSize: 14, color: BODY, marginTop: 3 }}>
                    {[TIPO_LABEL[p.tipo ?? ""] ?? "Sem tipo", contLabel(p), data].filter(Boolean).join("  ·  ")}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* barra fixa com a ação */}
      {sel.size > 0 && !dialogo && (
        <div style={{ position: "sticky", bottom: 16, maxWidth: 920, margin: "16px auto 0", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: NAVY, color: "#fff", borderRadius: 16, padding: "12px 12px 12px 20px", boxShadow: "0 10px 30px rgba(13,31,48,.25)" }}>
          <span style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>
            {sel.size} {sel.size === 1 ? "pacote selecionado" : "pacotes selecionados"}
          </span>
          <button type="button" onClick={() => setSel(new Set())} style={{ ...pill, background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.35)" }}>
            Limpar seleção
          </button>
          <button
            type="button" onClick={() => abrirPublicar(selecionadosPublicaveis)}
            disabled={selecionadosPublicaveis.length === 0}
            title={selecionadosPublicaveis.length === 0 ? "Os selecionados já estão publicados, sem alterações" : undefined}
            style={{ ...pill, background: OK, borderColor: OK, color: "#fff", opacity: selecionadosPublicaveis.length ? 1 : 0.45, cursor: selecionadosPublicaveis.length ? "pointer" : "not-allowed" }}
          >
            <UploadSimple size={18} weight="bold" /> Publicar selecionados {dot("#fff")}
          </button>
          <button type="button" onClick={abrirExcluir} style={{ ...pill, background: DANGER, borderColor: DANGER, color: "#fff" }}>
            <Trash size={18} weight="bold" /> Excluir selecionados {dot("#fff")}
          </button>
        </div>
      )}

      {/* diálogo de confirmação (publicar ou excluir) */}
      {dialogo && (
        <div
          onClick={fecharDialogo}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(13,31,48,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            role="dialog" aria-modal="true" aria-labelledby="bulk-dialog-title"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: FONT, color: NAVY, background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}
          >
            <div style={{ padding: "22px 24px 14px" }}>
              <h2 id="bulk-dialog-title" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                {publicando ? "Publicar" : "Excluir"} {listaDialogo.length} {listaDialogo.length === 1 ? "pacote" : "pacotes"}?
              </h2>
              <p style={{ fontSize: 15, color: BODY, margin: "6px 0 0" }}>Confira a lista antes de continuar:</p>
            </div>

            <ul style={{ margin: 0, padding: "4px 24px", listStyle: "none", overflowY: "auto", flex: "0 1 auto", borderTop: `1px dashed ${DASH}`, borderBottom: `1px dashed ${DASH}` }}>
              {listaDialogo.map((p) => (
                <li key={p.id} style={{ fontSize: 16, padding: "9px 0", display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ color: MUTED, fontSize: 11 }}>●</span>
                  <span>
                    <strong>{p.titulo}</strong>
                    <span style={{ color: MUTED, fontSize: 14 }}>
                      {"  "}{TIPO_LABEL[p.tipo ?? ""] ?? ""}{publicando && p.publicado ? " · atualiza a versão que está no site" : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ padding: "16px 24px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {publicando ? (
                <div style={{ display: "flex", gap: 10, background: "#EAF6EF", border: "1px solid #BFE3CD", borderRadius: 12, padding: "12px 14px", color: "#135E33", fontSize: 15, lineHeight: 1.45 }}>
                  <CheckCircle size={22} weight="fill" style={{ flexShrink: 0 }} />
                  <span>
                    Os pacotes vão para o site com o conteúdo que está no CMS agora. Pode levar <strong>até 10 minutos</strong> para aparecer.
                    {ignorados > 0 && ` ${ignorados} selecionado(s) já estão publicados sem alterações e ficam como estão.`}
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 10, background: "#FDF0EF", border: "1px solid #F4C7C3", borderRadius: 12, padding: "12px 14px", color: DANGER, fontSize: 15, lineHeight: 1.45 }}>
                    <Warning size={22} weight="fill" style={{ flexShrink: 0 }} />
                    <span>Isso apaga o pacote <strong>publicado e os rascunhos</strong>. As páginas saem do site. <strong>Não dá para desfazer.</strong></span>
                  </div>

                  <label style={{ fontSize: 15, color: BODY, display: "flex", flexDirection: "column", gap: 8 }}>
                    <span>Para confirmar, digite <strong style={{ color: NAVY }}>{CONFIRM_WORD}</strong> abaixo:</span>
                    <input
                      autoFocus value={digitado} disabled={ocupado}
                      onChange={(e) => setDigitado(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") excluir() }}
                      placeholder={CONFIRM_WORD} autoComplete="off" spellCheck={false}
                      style={{ fontFamily: FONT, fontSize: 17, color: NAVY, padding: "12px 14px", borderRadius: 10, outline: "none", border: `2px solid ${confirmado ? DANGER : BOXBD}` }}
                    />
                  </label>
                </>
              )}

              {erroAcao && (
                <p style={{ margin: 0, fontSize: 14, color: DANGER }}>
                  Não foi possível {publicando ? "publicar" : "excluir"}: {erroAcao}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
                <button type="button" onClick={fecharDialogo} disabled={ocupado} style={pill}>Cancelar</button>
                {publicando ? (
                  <button
                    type="button" onClick={publicar} disabled={ocupado} autoFocus
                    style={{ ...pill, background: OK, borderColor: OK, color: "#fff", opacity: ocupado ? 0.5 : 1, cursor: ocupado ? "not-allowed" : "pointer" }}
                  >
                    <UploadSimple size={18} weight="bold" /> {ocupado ? "Publicando…" : "Publicar agora"} {dot("#fff")}
                  </button>
                ) : (
                  <button
                    type="button" onClick={excluir} disabled={!confirmado || ocupado}
                    style={{ ...pill, background: DANGER, borderColor: DANGER, color: "#fff", opacity: !confirmado || ocupado ? 0.4 : 1, cursor: !confirmado || ocupado ? "not-allowed" : "pointer" }}
                  >
                    <Trash size={18} weight="bold" /> {ocupado ? "Excluindo…" : "Excluir definitivamente"} {dot("#fff")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Tag = ({ children, cor, fundo }: { children: React.ReactNode; cor: string; fundo: string }) => (
  <span style={{ fontSize: 12, fontWeight: 700, color: cor, background: fundo, borderRadius: 999, padding: "3px 9px", letterSpacing: ".02em" }}>
    {children}
  </span>
)
