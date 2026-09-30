import { urlFor } from "@/sanity/lib/image"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ViagemRaw = {
  _id: string
  titulo: string
  slug: string
  local?: string
  data?: string
  capa: any
  totalFotos?: number
}

/* Já com as URLs prontas — o slider (client) não precisa do builder */
export type ViagemSlide = {
  id: string
  slug: string
  titulo: string
  local?: string
  quando?: string
  totalFotos: number
  bg: string
  card: string
  thumb: string
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

/* "2025-10-08" → "Out 2025" */
export function mesAno(iso?: string) {
  if (!iso) return undefined
  const [y, m] = iso.split("-")
  const mes = MESES[Number(m) - 1]
  return mes && y ? `${mes} ${y}` : undefined
}

export const fotosLabel = (n: number) => (n === 1 ? "1 foto" : `${n} fotos`)

export function toSlide(v: ViagemRaw): ViagemSlide {
  return {
    id: v._id,
    slug: v.slug,
    titulo: v.titulo,
    local: v.local,
    quando: mesAno(v.data),
    totalFotos: v.totalFotos ?? 0,
    bg:    urlFor(v.capa).width(1920).height(1080).fit("crop").url(),
    card:  urlFor(v.capa).width(880).height(1100).fit("crop").url(),
    thumb: urlFor(v.capa).width(900).height(600).fit("crop").url(),
  }
}
