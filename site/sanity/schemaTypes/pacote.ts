import { defineField, defineType, defineArrayMember } from "sanity"
import { AIRPORT_OPTIONS } from "../../lib/airports"
import { areaPreview, HeroLiveField } from "../components/FieldPreview"
import { DocProgress } from "../components/DocProgress"

/* Rótulos amigáveis (usados no Studio: seleção em massa etc.) */
export const TIPO_LABEL: Record<string, string> = {
  gruposDoRuas:      "Grupos do Ruas",
  assinadoByRuas:    "Assinados by Ruas",
}
export const CONTINENTE_LABEL: Record<string, string> = {
  "africa":          "África",
  "america-norte":   "América do Norte",
  "america-sul":     "América do Sul",
  "america-central": "América Central",
  "asia":            "Ásia",
  "europa":          "Europa",
}

/* Só as ordenações que ajudam a categorizar — o Sanity, sem isso, lista
   "Sort by" para TODOS os campos e confunde. */
export const PACOTE_SORTS = [
  { name: "tipo",       title: "Tipo",                    by: [{ field: "tipo", direction: "asc" }, { field: "titulo", direction: "asc" }] },
  { name: "data",       title: "Data de ida",             by: [{ field: "dataIda", direction: "asc" }, { field: "titulo", direction: "asc" }] },
  { name: "nome",       title: "Nome (A–Z)",              by: [{ field: "titulo", direction: "asc" }] },
  { name: "continente", title: "Continente",              by: [{ field: "continentes[0]", direction: "asc" }, { field: "titulo", direction: "asc" }] },
] as const

export const pacote = defineType({
  name:  "pacote",
  title: "Pacote",
  type:  "document",

  /* barra de progresso da aba ativa no topo do formulário */
  components: { input: DocProgress },

  /* ── Abas no topo do documento ──────────────────────── */
  groups: [
    { name: "basico",       title: "Básico",        default: true },
    { name: "rota",         title: "Rota & Datas"                  },
    { name: "investimento", title: "Investimento"                  },
    { name: "termos",       title: "Termos"                        },
    { name: "conteudo",     title: "Conteúdo"                      },
    { name: "seo",          title: "SEO"                           },
  ],

  /* ida/volta lado a lado */
  fieldsets: [
    {
      name: "datas",
      title: "Datas da viagem",
      description: "A duração em dias é calculada automaticamente pelas datas.",
      options: { columns: 2 },
    },
  ],

  fields: [

    /* ══ BÁSICO ═══════════════════════════════════════════ */
    defineField({
      name: "titulo", title: "Nome do destino", group: "basico",
      type: "string", validation: r => r.required(),
      description: "Aparece na lista, no topo da página e no ticket (ex: Egito).",
    }),
    defineField({
      name: "slug", title: "Slug (URL)", group: "basico",
      type: "slug",
      options: {
        source: "titulo",
        /* normaliza: minúsculo, sem acento, espaços→"-", tira caracteres */
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize("NFD").replace(/[̀-ͯ]/g, "")
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 96),
      },
      validation: r => r.required(),
      description: "Endereço da página. Ao digitar/gerar, é normalizado (minúsculo, sem acento, espaços viram '-').",
    }),
    defineField({
      name: "tipo",
      title: "Tipo de produto", group: "basico",
      type: "string",
      options: {
        list: [
          { title: "🏆 Grupos do Ruas — Rodrigo guia pessoalmente",       value: "gruposDoRuas"      },
          { title: "✍️ Pacotes Assinados by Ruas — curadoria do Rodrigo",  value: "assinadoByRuas"    },
        ],
        layout: "radio",
      },
      initialValue: "gruposDoRuas",
      validation: r => r.required(),
    }),
    defineField({
      name: "badge", title: "Badge", group: "basico",
      type: "string",
      options: { list: ["vagas", "esgotado"] },
      description: "Selo na lista: 'vagas' (aviso) ou 'esgotado' (opaco e sem link).",
    }),
    defineField({
      name: "heroImage", title: "Imagem principal (hero)", group: "basico",
      type: "image",
      options: { hotspot: true },
      validation: r => r.required(),
      description: "Foto do topo da página. Paisagem (16:9), mínimo 1600px.",
      components: { field: HeroLiveField },
    }),
    defineField({
      name: "descricaoCurta",
      title: "Descrição curta (homepage)", group: "basico",
      type: "string",
      description: "Aparece nos cards da homepage. Máximo 120 caracteres.",
      validation: r => r.max(120).warning("Mantenha abaixo de 120 chars para não cortar no card"),
    }),
    defineField({
      name: "prioridade",
      title: "Posição na homepage (dentro do seu tipo)", group: "basico",
      type: "string",
      options: {
        list: [
          { title: "⭐ Destaque — card grande no topo",    value: "destaque"  },
          { title: "🎠 Carrossel — rolagem lateral",        value: "carrossel" },
          { title: "🙈 Não exibir na homepage",             value: "oculto"    },
        ],
        layout: "radio",
      },
      initialValue: "carrossel",
      validation: r => r.required(),
    }),
    defineField({
      name: "ordem",
      title: "Ordem no carrossel (1 aparece primeiro)", group: "basico",
      type: "number",
      initialValue: 99,
    }),
    defineField({
      name: "continentes", title: "Continentes / Regiões", group: "basico",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Usado no filtro por região na página de destinos.",
    }),

    /* ══ ROTA & DATAS ═════════════════════════════════════ */
    defineField({
      name: "aeroportoPartida",
      title: "Aeroporto de partida", group: "rota",
      type: "string",
      options: { list: AIRPORT_OPTIONS },
      initialValue: "GRU",
      description: "Selecione da lista. Vira 'São Paulo (GRU)' no ticket.",
      components: { field: areaPreview("/cms-preview/rota.png", "Rota — aparece assim no ticket") },
    }),
    defineField({
      name: "aeroportoDestino",
      title: "Aeroporto de destino", group: "rota",
      type: "string",
      options: { list: AIRPORT_OPTIONS },
    }),
    defineField({
      name: "dataIda",
      title: "Data de ida", group: "rota", fieldset: "datas",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "dataVolta",
      title: "Data de volta", group: "rota", fieldset: "datas",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({ name: "dias",     title: "Duração (dias) — usada se não houver datas", type: "number", group: "rota" }),
    defineField({ name: "periodo",  title: "Período (texto, ex: Outubro 2026)", type: "string", group: "rota" }),
    defineField({ name: "partida",  title: "Partida (texto curto, ex: 04/10)",  type: "string", group: "rota" }),
    defineField({ name: "vagas",    title: "Número de vagas",                    type: "number", group: "rota" }),

    /* ══ INVESTIMENTO ═════════════════════════════════════ */
    defineField({
      name: "moeda",
      title: "Moeda", group: "investimento",
      type: "string",
      options: {
        list: [
          { title: "US$ (Dólar)", value: "US$" },
          { title: "R$ (Real)",   value: "R$"  },
          { title: "€ (Euro)",    value: "€"   },
        ],
        layout: "radio",
      },
      initialValue: "US$",
      components: { field: areaPreview("/cms-preview/investimento.png", "Investimento — aparece assim no ticket") },
    }),
    defineField({
      name: "entrada",
      title: "Entrada (valor por pessoa)", group: "investimento",
      type: "number",
      description: "Ex: 2300 → US$ 2.300 (Entrada).",
    }),
    defineField({
      name: "numParcelas",
      title: "Número de parcelas", group: "investimento",
      type: "number",
      description: "Ex: 9 → 9x.",
    }),
    defineField({
      name: "valorParcela",
      title: "Valor de cada parcela", group: "investimento",
      type: "number",
      description: "Ex: 445 → 9x US$ 445.",
    }),

    /* ══ TERMOS ═══════════════════════════════════════════ */
    defineField({
      name: "politicaCancelamento",
      title: "Política de cancelamento", group: "termos",
      type: "string",
      options: {
        list: [
          { title: "Não reembolsável",              value: "nao-reembolsavel"   },
          { title: "50% de reembolso",               value: "50-reembolsavel"    },
          { title: "Reembolso total (30+ dias antes)", value: "reembolsavel"     },
        ],
        layout: "radio",
      },
      initialValue: "nao-reembolsavel",
      components: { field: areaPreview("/cms-preview/termos.png", "Termos — aparece assim no ticket") },
    }),
    defineField({
      name: "politicaReagendamento",
      title: "Taxa de reagendamento", group: "termos",
      type: "string",
      description: 'Ex: "R$ 500,00" ou "Gratuito até 60 dias antes"',
      initialValue: "R$ 500,00",
    }),
    defineField({
      name: "seguroValor",
      title: "Seguro viagem — valor (riscado)", group: "termos",
      type: "string",
      description: 'Aparece riscado ao lado do status. Ex: "R$ 129". Deixe vazio para não mostrar.',
      initialValue: "R$ 129",
    }),
    defineField({
      name: "seguroStatus",
      title: "Seguro viagem — status", group: "termos",
      type: "string",
      description: '"Incluso" (verde) ou "Não incluso" (cinza).',
      initialValue: "Incluso",
    }),

    /* ══ CONTEÚDO ═════════════════════════════════════════ */
    defineField({
      name: "tagline",
      title: "Tagline do ticket (badge)", group: "conteudo",
      type: "string",
      description: 'Frase no topo do ticket. Padrão: "Eternize esse momento da melhor maneira".',
      components: { field: areaPreview("/cms-preview/tagline.png", "Badge — topo do ticket") },
    }),
    defineField({
      name: "rodapeAtendimento",
      title: "Ticket — texto de atendimento", group: "conteudo",
      type: "string",
      initialValue: "Fale direto com nosso atendimento",
      components: { field: areaPreview("/cms-preview/rodape.png", "Rodapé do ticket") },
    }),
    defineField({
      name: "rodapeSeguranca",
      title: "Ticket — texto de segurança", group: "conteudo",
      type: "string",
      initialValue: "Compra segura",
    }),
    defineField({
      name: "incluso", title: "O que está incluso", group: "conteudo",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Lista do ticket (a linha de passagem aérea é ocultada automaticamente).",
      components: { field: areaPreview("/cms-preview/incluso.png", "Incluso — aparece assim no ticket") },
    }),
    defineField({
      name: "naoIncluso", title: "O que NÃO está incluso", group: "conteudo",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "intro", title: "Introdução (texto longo)", group: "conteudo",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Parágrafo editorial de abertura — logo abaixo do hero.",
    }),
    defineField({
      name: "pullQuote", title: "Pull quote", group: "conteudo",
      type: "text", rows: 3,
      description: "Frase de destaque grande no meio da página.",
    }),
    defineField({
      name: "itinerario", title: "Itinerário", group: "conteudo",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "dia",
          title: "Dia",
          fields: [
            defineField({ name: "numero", title: "Dia nº", type: "number" }),
            defineField({
              name: "titulo", title: "Título do dia", type: "string",
              description: "Use → para deslocamentos (ex: Atenas → Mykonos).",
            }),
            defineField({
              name: "resumo", title: "Resumo do dia", type: "text", rows: 2,
              description: "Uma ou duas frases. Aparece grande, logo abaixo do título.",
            }),
            defineField({
              name: "passeios", title: "Destaques do dia",
              type: "array", of: [defineArrayMember({ type: "string" })],
              description: "Só o nome do lugar ou atividade, até 4 palavras (ex: Mesquita Azul). Ideal: de 2 a 4 itens.",
            }),
            defineField({
              name: "refeicoes", title: "Refeições incluídas", type: "string",
              description: 'Ex: "Café da manhã e jantar". Deixe vazio se não houver.',
            }),
            defineField({
              name: "hospedagem", title: "Hospedagem", type: "string",
              description: 'Onde dorme nessa noite. Ex: "Lecce" ou "Cruzeiro pelo Nilo".',
            }),
            defineField({
              name: "opcionais", title: "Passeios opcionais",
              type: "array", of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "observacao", title: "Observação (opcional)", type: "string",
              description: "Aviso curto, ex: traje exigido, horário do voo.",
            }),
            defineField({
              name: "texto", title: "Descrição livre (formato antigo)",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              description: "Só aparece no site se o Resumo estiver vazio.",
              /* esconde o campo antigo quando não tem conteúdo */
              hidden: ({ value }) => !value,
            }),
            defineField({
              name: "imagem", title: "Imagem do dia (opcional)",
              type: "image", options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "titulo", numero: "numero" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (sel: any) => ({ title: `Dia ${sel.numero} — ${sel.title}` }),
          },
        }),
      ],
    }),
    defineField({
      name: "galeria", title: "Galeria de fotos", group: "conteudo",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),

    /* ══ SEO ══════════════════════════════════════════════ */
    defineField({
      name: "metaDescricao", title: "Meta descrição (SEO)", group: "seo",
      type: "text", rows: 2,
    }),
  ],

  orderings: PACOTE_SORTS.map(({ name, title, by }) => ({ name, title, by: by.map((b) => ({ ...b })) })),

  preview: {
    select: { title: "titulo", subtitle: "periodo", media: "heroImage" },
  },
})
