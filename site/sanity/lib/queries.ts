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
      resumo,
      passeios,
      refeicoes,
      hospedagem,
      opcionais,
      observacao,
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

/* ── Viagens realizadas (galeria) ────────────────────────── */
export const VIAGENS_REALIZADAS_QUERY = groq`
  *[_type == "viagemRealizada" && defined(slug.current) && defined(capa)] | order(data desc, titulo asc) {
    _id, titulo, local, data, capa,
    "slug": slug.current,
    "totalFotos": count(fotos),
  }
`

export const VIAGEM_REALIZADA_BY_SLUG_QUERY = groq`
  *[_type == "viagemRealizada" && slug.current == $slug][0] {
    _id, titulo, local, data, capa, resumo,
    "slug": slug.current,
    fotos[] { _key, legenda, asset, hotspot, crop, "dim": asset->metadata.dimensions { width, height } },
    "outras": *[_type == "viagemRealizada" && slug.current != $slug && defined(slug.current) && defined(capa)]
      | order(data desc) [0...3] { _id, titulo, local, data, capa, "slug": slug.current },
  }
`

export const VIAGENS_SLUGS_QUERY = groq`
  *[_type == "viagemRealizada" && defined(slug.current)] { "slug": slug.current }
`

/* ── Slugs para generateStaticParams ─────────────────────── */
export const PACOTES_SLUGS_QUERY = groq`
  *[_type == "pacote"] { "slug": slug.current }
`
