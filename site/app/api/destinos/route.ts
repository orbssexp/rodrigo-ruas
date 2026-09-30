import { NextRequest, NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"

const TIPOS_VALIDOS = new Set(["all", "gruposDoRuas", "assinadoByRuas"])

/* Retorna todos os pacotes de um tipo específico, incluindo esgotados */
const QUERY = groq`
  *[_type == "pacote" && (
    $tipo == "all" || tipo == $tipo
  )] | order(ordem asc) {
    titulo,
    "slug": slug.current,
    tipo,
    badge,
    periodo,
    prioridade,
  }
`

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get("tipo") ?? "all"

  if (!TIPOS_VALIDOS.has(tipo)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  }

  try {
    const destinos = await client.fetch(QUERY, { tipo })
    return NextResponse.json(destinos ?? [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
