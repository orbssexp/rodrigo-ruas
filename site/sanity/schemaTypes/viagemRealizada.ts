import { defineField, defineType, defineArrayMember } from "sanity"

/* Viagens que a RR Viagens já fez — alimenta a galeria /viagens-realizadas.
   Poucos campos de propósito: destino, onde, quando, capa e fotos. */

export const VIAGEM_SORTS = [
  { name: "data", title: "Data (mais recente)", by: [{ field: "data", direction: "desc" }] },
  { name: "nome", title: "Nome (A–Z)",          by: [{ field: "titulo", direction: "asc" }] },
] as const

export const viagemRealizada = defineType({
  name:  "viagemRealizada",
  title: "Viagem realizada",
  type:  "document",

  fields: [
    defineField({
      name: "titulo", title: "Destino",
      type: "string", validation: r => r.required(),
      description: "Nome grande que aparece na galeria (ex: Japão).",
    }),
    defineField({
      name: "slug", title: "Slug (URL)",
      type: "slug",
      options: {
        source: "titulo",
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
      description: "Endereço da página. Clique em Generate para criar a partir do destino.",
    }),
    defineField({
      name: "local", title: "Cidades / país",
      type: "string",
      description: "Linha menor abaixo do destino (ex: Kyoto, Tóquio e Osaka).",
    }),
    defineField({
      name: "data", title: "Quando foi",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      description: "Data de partida. No site aparece só mês e ano (ex: Out 2025).",
    }),
    defineField({
      name: "capa", title: "Foto de capa",
      type: "image", options: { hotspot: true },
      validation: r => r.required(),
      description: "Foto principal: aparece grande na galeria. Prefira uma foto horizontal.",
    }),
    defineField({
      name: "resumo", title: "Resumo da viagem (opcional)",
      type: "text", rows: 3,
      description: "Duas ou três frases sobre como foi. Aparece no topo da página do destino.",
    }),
    defineField({
      name: "fotos", title: "Fotos da viagem",
      type: "array",
      options: { layout: "grid" },
      description: "Arraste várias fotos de uma vez. A ordem aqui é a ordem no site.",
      of: [defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({ name: "legenda", title: "Legenda (opcional)", type: "string" }),
        ],
      })],
    }),
  ],

  orderings: VIAGEM_SORTS.map(({ name, title, by }) => ({ name, title, by: by.map((b) => ({ ...b })) })),

  preview: {
    select: { title: "titulo", local: "local", data: "data", media: "capa" },
    prepare: ({ title, local, data, media }) => ({
      title,
      subtitle: [local, data ? String(data).split("-").reverse().slice(1).join("/") : null].filter(Boolean).join(" · "),
      media,
    }),
  },
})
