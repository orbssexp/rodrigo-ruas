import { groq } from "next-sanity"

/* campos base reutilizados nas queries da home */
const PACOTE_CARD_FIELDS = `
  _id,
  titulo,
  "slug": slug.current,
  badge,
  heroImage,
  periodo,
  dias,
  partida,
  vagas,
  moeda,
  entrada,
  numParcelas,
  valorParcela,
  continentes,
  descricaoCurta,
  prioridade,
  ordem,
`

/* ── Homepage: 3 seções por tipo ─────────────────────────── */
export const HOMEPAGE_QUERY = groq`
  {
    "gruposDoRuas": *[_type == "pacote" && tipo == "gruposDoRuas" && prioridade != "oculto"]
      | order(ordem asc) { ${PACOTE_CARD_FIELDS} },

    "assinadoByRuas": *[_type == "pacote" && tipo == "assinadoByRuas" && prioridade != "oculto"]
      | order(ordem asc) { ${PACOTE_CARD_FIELDS} },

    "gruposBrasileiros": *[_type == "pacote" && tipo == "gruposBrasileiros" && prioridade != "oculto"]
      | order(ordem asc) { ${PACOTE_CARD_FIELDS} },
  }
`

/* ── Detalhe completo de um pacote ───────────────────────── */
export const PACOTE_BY_SLUG_QUERY = groq`
  *[_type == "pacote" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    badge,
    heroImage,
    periodo,
    dias,
    partida,
    vagas,
    tipo,
    moeda,
    entrada,
    numParcelas,
    valorParcela,
    aeroportoPartida,
    aeroportoDestino,
    dataIda,
    dataVolta,
    politicaCancelamento,
    politicaReagendamento,
    seguroValor,
    seguroStatus,
    tagline,
    rodapeAtendimento,
    rodapeSeguranca,
    continentes,
    intro,
    pullQuote,
    itinerario[] {
      numero,
      titulo,
      texto,
      imagem,
    },
    galeria,
    incluso,
    naoIncluso,
    metaDescricao,
  }
`

/* ── Conteúdo da Homepage (singleton) ────────────────────── */
export const HOMEPAGE_CONTENT_QUERY = groq`
  *[_type == "homepage" && _id == "singleton-homepage"][0] {
    heroLabel, heroLine1, heroLine2, heroSub,
    stats[]  { valor, sufixo, label },
    passos[] { numero, titulo, corpo },
    depoimentoTexto, depoimentoAutor,
    ctaTitulo, ctaSubtitulo,
    secaoGruposLabel, secaoGruposTitulo, secaoGruposDesc,
    secaoAssinadosLabel, secaoAssinadosTitulo, secaoAssinadosDesc,
    secaoGruposBrLabel, secaoGruposBrTitulo, secaoGruposBrDesc,
    "heroSlides": heroSlides[] {
      "src": imagem.asset->url + "?w=1920&fit=crop&fm=webp&q=80",
      alt,
    },
    "rodrigoFotoUrl": rodrigoFoto.asset->url + "?w=900&fit=crop&fm=webp&q=85",
  }
`

/* ── Formulário de contato (singleton) ───────────────────── */
export const FORMULARIO_QUERY = groq`
  *[_type == "formulario" && _id == "singleton-formulario"][0] {
    titulo, descricao, webhookUrl, redirectAoEnviar,
    mensagemSucesso, textoBotao,
    imagemDestaque,
    campos[] { tipo, label, nome, placeholder, obrigatorio, opcoes },
  }
`

/* ── Grupos WhatsApp (FerrisWheel da home) ───────────────── */
export const GRUPOS_WHATSAPP_QUERY = groq`
  *[_type == "grupoWhatsapp" && ativo == true] | order(ordem asc) {
    _id,
    nome,
    destino,
    heroImage,
    partida,
    membros,
    maxMembros,
    status,
  }
`

/* ── Slugs para generateStaticParams ─────────────────────── */
export const PACOTES_SLUGS_QUERY = groq`
  *[_type == "pacote"] { "slug": slug.current }
`
