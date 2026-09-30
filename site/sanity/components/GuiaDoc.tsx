"use client"

/* Guia de uso do CMS — em slides, no MESMO vocabulário visual do ticket de
   pricing do site: card branco arredondado, divisórias pontilhadas, sub-box
   cinza dos "Termos", ícone "i" e botão pill navy + dot. */

import { useEffect, useState } from "react"

/* paleta do ticket */
const NAVY   = "#0D1F30"
const BODY   = "#3D5A6E"
const MUTED  = "#7090A0"
const DASH   = "#E2E8F0"
const BOXBG  = "#F5F7F9"
const BOXBD  = "#E9EEF3"
const WARN   = "#A06020"
const ON_FG  = "#FFFFFF"
const FONT   = '"DM Sans", system-ui, -apple-system, sans-serif'

/* linha pontilhada (igual às do ticket) */
const Dash = () => <div style={{ borderTop: `1px dashed ${DASH}` }} />

/* linha "● Nome — descrição" com pontilhado embaixo */
const Row = ({ nome, children, last }: { nome: string; children: React.ReactNode; last?: boolean }) => (
  <>
    <div style={{ display: "flex", gap: 12, padding: "13px 2px", alignItems: "baseline" }}>
      <span style={{ color: MUTED, fontSize: 12, lineHeight: 1.6 }}>●</span>
      <span style={{ fontSize: 16, lineHeight: 1.5 }}>
        <strong style={{ color: NAVY, fontWeight: 700 }}>{nome}</strong>
        <span style={{ color: BODY }}>&nbsp;&nbsp;{children}</span>
      </span>
    </div>
    {!last && <Dash />}
  </>
)

/* sub-box cinza com ícone "i" — igual ao box "Termos e condições" */
const InfoBox = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <div style={{ background: BOXBG, border: `1px solid ${BOXBD}`, borderRadius: 14, overflow: "hidden", marginTop: 22 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: `1px dashed ${DASH}` }}>
      <span style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${NAVY}`, color: NAVY, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic" }}>i</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{titulo}</span>
    </div>
    <div style={{ padding: "13px 16px", fontSize: 15, color: BODY, lineHeight: 1.55 }}>{children}</div>
  </div>
)

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 17, color: BODY, lineHeight: 1.55, margin: "0 0 6px" }}>{children}</p>
)

/* ── slides ─────────────────────────────────────────── */
type Slide = { kicker: string; title: string; body: React.ReactNode }

const SLIDES: Slide[] = [
  {
    kicker: "Comece aqui", title: "Como funciona",
    body: (
      <>
        <Lead>Aqui você edita tudo que aparece no site da RR Viagens — sem precisar entender de código.</Lead>
        <div style={{ marginTop: 12 }}>
          <Row nome="1 · Escolha">o que editar no menu da esquerda: Pacotes, Viagens realizadas, Homepage ou Formulário.</Row>
          <Row nome="2 · Preencha">os campos, organizados em abas no topo. A barra de progresso mostra quanto falta.</Row>
          <Row nome="3 · Confira">os prints que vários campos trazem, mostrando onde aquilo aparece no site.</Row>
          <Row nome="4 · Publique" last>no botão do canto inferior direito. Em poucos minutos entra no ar.</Row>
        </div>
      </>
    ),
  },
  {
    kicker: "Conteúdo", title: "Pacotes",
    body: (
      <>
        <Lead>Cada pacote vira uma página no site. Para criar: <strong style={{ color: NAVY }}>Pacotes → o “+” no topo</strong>.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Básico">Nome, foto principal, tipo e onde aparece na home. A imagem mostra a página ao vivo.</Row>
          <Row nome="Rota & Datas">Aeroportos (da lista), datas de ida/volta e vagas. A duração é calculada sozinha.</Row>
          <Row nome="Investimento">Moeda, entrada, nº de parcelas e valor. Ex.: US$ 2.300 + 9x US$ 445.</Row>
          <Row nome="Termos">Seguro, cancelamento e reagendamento.</Row>
          <Row nome="Conteúdo">Frase do topo, incluso/não incluso, roteiro, galeria e introdução.</Row>
          <Row nome="SEO" last>Uma frase para o Google. Opcional.</Row>
        </div>
        <InfoBox titulo="Atalhos úteis">
          Esconder sem apagar: <strong style={{ color: NAVY }}>Posição na homepage → “Não exibir”</strong>. Esgotar: <strong style={{ color: NAVY }}>Badge → Esgotado</strong>. Publicar ou excluir vários de uma vez: <strong style={{ color: NAVY }}>Pacotes → “⋯” → Selecionar vários</strong>.
        </InfoBox>
      </>
    ),
  },
  {
    kicker: "Conteúdo", title: "Viagens realizadas",
    body: (
      <>
        <Lead>A galeria de viagens que já aconteceram (menu <strong style={{ color: NAVY }}>Galeria</strong> do site). Cada viagem vira uma página com as fotos.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Destino e cidades">O nome grande e a linha menor embaixo (ex: Japão · Kyoto e Tóquio).</Row>
          <Row nome="Quando foi">A data de partida. No site aparece só mês e ano.</Row>
          <Row nome="Foto de capa">A foto grande da galeria. Prefira horizontal.</Row>
          <Row nome="Fotos" last>Arraste várias de uma vez. A ordem no CMS é a ordem no site.</Row>
        </div>
        <InfoBox titulo="Dica">
          Clique em <strong style={{ color: NAVY }}>Generate</strong> no Slug depois de digitar o destino. Sem capa e slug a viagem não aparece no site.
        </InfoBox>
      </>
    ),
  },
  {
    kicker: "Conteúdo", title: "Homepage",
    body: (
      <>
        <Lead>Textos e imagens da página inicial (é uma página só). O primeiro campo mostra a home ao vivo.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Hero">Topo da página: frase de cima, título grande, subtítulo e as fotos do carrossel.</Row>
          <Row nome="Números & Processo">Os números (países, anos…) e os 3 passos de “como funciona”.</Row>
          <Row nome="Seções">Títulos e descrições das seções de pacotes.</Row>
          <Row nome="Depoimento & CTA" last>Depoimento de cliente, chamada final e foto do Rodrigo.</Row>
        </div>
      </>
    ),
  },
  {
    kicker: "Conteúdo", title: "Formulário de contato",
    body: (
      <>
        <Lead>O formulário que abre quando alguém clica em “Falar” ou “Quero este pacote”.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Conteúdo">Título, descrição, texto do botão, mensagem de sucesso e imagem.</Row>
          <Row nome="Campos">O que a pessoa preenche (nome, WhatsApp…). Destino e programa são automáticos.</Row>
          <Row nome="Envio" last>O endereço que recebe os dados (webhook). Não altere sem o desenvolvedor.</Row>
        </div>
      </>
    ),
  },
  {
    kicker: "Ser achado", title: "Dicas de SEO",
    body: (
      <>
        <Lead>Pequenos cuidados ajudam o site a aparecer no Google e a converter melhor.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Título específico">“Egito — Cairo e Cruzeiro no Nilo” diz mais e atrai mais cliques que só “Egito”.</Row>
          <Row nome="Descrição curta">Resume o pacote em 1 linha. Aparece nos cards e ajuda o Google.</Row>
          <Row nome="Meta descrição">Frase convidativa com o destino — pode aparecer na busca do Google.</Row>
          <Row nome="Conteúdo completo">Roteiro, incluso e introdução. Mais texto real e único = melhor posição.</Row>
          <Row nome="Fotos de qualidade" last>Paisagem, nítidas e leves. Carregam rápido e vendem mais.</Row>
        </div>
        <InfoBox titulo="Já é automático">
          O endereço da página (slug) é ajustado sozinho: minúsculo, sem acento e com “-” no lugar de espaços.
        </InfoBox>
      </>
    ),
  },
  {
    kicker: "Bom saber", title: "Boas práticas",
    body: (
      <>
        <Lead>Um checklist rápido para manter o site sempre certinho.</Lead>
        <div style={{ marginTop: 6 }}>
          <Row nome="Publique sempre">Nada aparece no site até clicar em Publicar (um aviso lembra do tempo de propagação).</Row>
          <Row nome="Revise antes">Use os prints “ao vivo” dos campos para conferir como ficou.</Row>
          <Row nome="Mantenha atualizado">Vagas, status, datas e preços. Conteúdo velho gera atrito na venda.</Row>
          <Row nome="Não mexa no técnico">Campos como o webhook (aba Envio) só com o desenvolvedor.</Row>
          <Row nome="Atalhos" last>Ctrl+Z desfaz · três pontinhos (···) revertem · Ctrl+K busca.</Row>
        </div>
      </>
    ),
  },
]

export function GuiaDoc() {
  const [i, setI] = useState(0)
  const total = SLIDES.length
  const go = (n: number) => setI((p) => Math.min(total - 1, Math.max(0, p + n)))
  const s = SLIDES[i]

  useEffect(() => {
    const id = "guia-dm-sans"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id; link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
    document.head.appendChild(link)
  }, [])

  const pill: React.CSSProperties = {
    fontFamily: FONT, fontSize: 15, fontWeight: 700, padding: "12px 24px", borderRadius: 999,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9, border: `1.5px solid ${NAVY}`,
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1) }}
      style={{ background: "#FAFAF8", padding: "44px clamp(20px,5vw,64px)", fontFamily: FONT, color: NAVY, outline: "none", minHeight: "100%" }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* card branco — altura fixa (viewport) p/ os botões não pularem entre slides */}
        <div style={{ background: "#fff", border: `1px solid ${BOXBD}`, borderRadius: 24, padding: "clamp(24px,4vw,38px)", boxShadow: "0 24px 60px -34px rgba(13,31,48,0.28)", height: "clamp(480px, calc(100vh - 230px), 640px)", display: "flex", flexDirection: "column" }}>

          {/* topo: kicker + contador */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>{s.kicker}</span>
            <span style={{ fontSize: 13, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{i + 1} / {total}</span>
          </div>

          {/* título */}
          <h1 style={{ margin: "0 0 18px", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.08, color: NAVY }}>{s.title}</h1>

          <Dash />

          {/* corpo — rola dentro do card se o slide for longo */}
          <div style={{ flex: 1, overflowY: "auto", paddingTop: 18, marginRight: -6, paddingRight: 6 }}>{s.body}</div>
        </div>

        {/* navegação — pills navy + dot, como o BtnPrimary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <button onClick={() => go(-1)} disabled={i === 0}
            style={{ ...pill, background: "transparent", color: NAVY, opacity: i === 0 ? 0.3 : 1, cursor: i === 0 ? "default" : "pointer" }}>
            ← Anterior
          </button>

          <div style={{ display: "flex", gap: 7 }}>
            {SLIDES.map((sl, idx) => (
              <button key={sl.title} onClick={() => setI(idx)} aria-label={sl.title}
                style={{ width: idx === i ? 22 : 8, height: 8, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", transition: "all .2s", background: idx === i ? NAVY : DASH }} />
            ))}
          </div>

          <button onClick={() => (i < total - 1 ? go(1) : setI(0))} style={{ ...pill, background: NAVY, color: ON_FG }}>
            {i < total - 1 ? "Próximo" : "Recomeçar"}
            <span style={{ width: 7, height: 7, borderRadius: 999, background: ON_FG }} />
          </button>
        </div>
      </div>
    </div>
  )
}
