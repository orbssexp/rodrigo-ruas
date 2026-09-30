import { defineField, defineType, defineArrayMember } from "sanity"
import { DocProgress } from "../components/DocProgress"
import { livePreviewField } from "../components/FieldPreview"

export const homepage = defineType({
  name:  "homepage",
  title: "Homepage",
  type:  "document",

  components: { input: DocProgress },

  groups: [
    { name: "hero",    title: "Hero",       default: true },
    { name: "numeros", title: "Números & Processo"        },
    { name: "secoes",  title: "Seções"                    },
    { name: "fim",     title: "Depoimento & CTA"          },
  ],

  fields: [

    /* ── HERO ─────────────────────────────────────── */
    defineField({
      name: "heroLabel", title: "Label acima do título", group: "hero",
      type: "string",
      description: 'Ex: "Curadoria de Expert"',
      initialValue: "Curadoria de Expert",
      components: { field: livePreviewField("/", "Homepage ao vivo") },
    }),
    defineField({
      name: "heroLine1", title: "Título — linha 1", group: "hero",
      type: "string",
      description: 'Ex: "PACOTES"',
      initialValue: "PACOTES",
    }),
    defineField({
      name: "heroLine2", title: "Título — linha 2", group: "hero",
      type: "string",
      description: 'Ex: "PELO MUNDO"',
      initialValue: "PELO MUNDO",
    }),
    defineField({
      name: "heroSub", title: "Subtítulo do hero", group: "hero",
      type: "text", rows: 2,
      description: "Aparece abaixo do título grande. Use \\n para quebrar linha.",
      initialValue: "Curadoria de expert para viajantes exigentes.\n93 países. 19 anos de estrada.",
    }),
    defineField({
      name: "heroSlides",
      title: "Hero — slides do carrossel", group: "hero",
      type: "array",
      description: "Imagens do carrossel principal. Deixe vazio para usar as imagens padrão.",
      of: [
        defineArrayMember({
          type: "object",
          name: "slide",
          fields: [
            defineField({
              name: "imagem", title: "Imagem",
              type: "image", options: { hotspot: true },
            }),
            defineField({
              name: "alt", title: "Destino / Legenda",
              type: "string",
              description: 'Ex: "Japão"',
            }),
          ],
          preview: {
            select: { media: "imagem", title: "alt" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: s.title ?? "Slide", media: s.media }),
          },
        }),
      ],
    }),

    /* ── NÚMEROS & PROCESSO ───────────────────────── */
    defineField({
      name: "stats", title: "Números (seção de estatísticas)", group: "numeros",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "valor",  title: "Número",       type: "number" }),
            defineField({ name: "sufixo", title: "Sufixo",       type: "string", description: 'Ex: "+" ou deixe vazio' }),
            defineField({ name: "label",  title: "Rótulo",       type: "string", description: 'Ex: "países visitados"' }),
          ],
          preview: {
            select: { valor: "valor", sufixo: "sufixo", label: "label" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: `${s.valor}${s.sufixo ?? ""} — ${s.label}` }),
          },
        }),
      ],
      initialValue: [
        { _key: "s1", valor: 93,   sufixo: "",  label: "países visitados"    },
        { _key: "s2", valor: 19,   sufixo: "+", label: "anos de experiência" },
        { _key: "s3", valor: 1500, sufixo: "+", label: "viajantes levados"   },
        { _key: "s4", valor: 40,   sufixo: "+", label: "destinos ativos"     },
      ],
    }),
    defineField({
      name: "passos", title: "Processo (3 passos)", group: "numeros",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "passo",
          fields: [
            defineField({ name: "numero", title: "Número", type: "string", description: 'Ex: "01"' }),
            defineField({ name: "titulo", title: "Título",  type: "string" }),
            defineField({ name: "corpo",  title: "Descrição", type: "text", rows: 2 }),
          ],
          preview: {
            select: { numero: "numero", titulo: "titulo" },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (s: any) => ({ title: `${s.numero} — ${s.titulo}` }),
          },
        }),
      ],
      initialValue: [
        { _key: "p1", numero: "01", titulo: "Escolha seu destino",   corpo: "Mais de 40 países com saídas programadas." },
        { _key: "p2", numero: "02", titulo: "Fale com nossa equipe", corpo: "Atendimento direto. Pessoa real, sem robô." },
        { _key: "p3", numero: "03", titulo: "Apareça no aeroporto",  corpo: "Passagem, hotel, passeios. O resto é com a gente." },
      ],
    }),

    /* ── SEÇÕES DE PRODUTOS ───────────────────────── */
    defineField({ name: "secaoGruposLabel",  title: "Grupos do Ruas — label",     type: "string", group: "secoes", initialValue: "Viaje comigo" }),
    defineField({ name: "secaoGruposTitulo", title: "Grupos do Ruas — título",    type: "string", group: "secoes", initialValue: "Grupos do Ruas" }),
    defineField({
      name: "secaoGruposDesc",   title: "Grupos do Ruas — descrição", type: "text", rows: 2, group: "secoes",
      initialValue: "Viagens exclusivas onde o Rodrigo está presente em cada passo do roteiro. Curadoria 100% dele.",
    }),
    defineField({ name: "secaoAssinadosLabel",  title: "Pacotes Assinados — label",  type: "string", group: "secoes", initialValue: "Curadoria validada" }),
    defineField({ name: "secaoAssinadosTitulo", title: "Pacotes Assinados — título", type: "string", group: "secoes", initialValue: "Pacotes Assinados by Ruas" }),
    defineField({
      name: "secaoAssinadosDesc",   title: "Pacotes Assinados — descrição", type: "text", rows: 2, group: "secoes",
      initialValue: "Roteiros desenhados, curados e aprovados pelo Rodrigo. Executados com o padrão de qualidade da RR Viagens.",
    }),

    /* ── DEPOIMENTO & CTA ─────────────────────────── */
    defineField({
      name: "depoimentoTexto", title: "Depoimento — texto", type: "text", rows: 3, group: "fim",
      initialValue: "Eu nunca tinha viajado para fora do Brasil. Com o Rodrigo, fui para o Japão e voltei diferente.",
    }),
    defineField({ name: "depoimentoAutor", title: "Depoimento — autor", type: "string", group: "fim", initialValue: "Maria C., São Paulo" }),
    defineField({
      name: "ctaTitulo", title: "CTA — título", type: "string", group: "fim",
      initialValue: "Sua próxima viagem começa com uma mensagem.",
    }),
    defineField({
      name: "ctaSubtitulo", title: "CTA — subtítulo", type: "text", rows: 2, group: "fim",
      initialValue: "Vagas limitadas. Atendimento personalizado. Sem chatbot, sem fila.",
    }),
    defineField({
      name: "rodrigoFoto",
      title: "Foto do Rodrigo", type: "image", group: "fim",
      description: "Foto de Rodrigo Ruas (seção \"Quem é Rodrigo\"). Deixe vazio para usar a padrão.",
      options: { hotspot: true },
    }),
  ],

  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
})
