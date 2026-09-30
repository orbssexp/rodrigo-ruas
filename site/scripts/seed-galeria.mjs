/**
 * Cadastra as Viagens realizadas (galeria /viagens-realizadas) no Sanity.
 *
 * Dados:  scripts/data/galeria.json
 * Fotos:  imgs/galeria/<slug>/NN.* (00 = capa; todas entram em "Fotos da viagem")
 *
 * - Grava como RASCUNHO; se já existe uma viagem publicada com o mesmo slug,
 *   o rascunho vai em cima dela (não duplica).
 *
 * Uso:  node scripts/seed-galeria.mjs          (todas)
 *       node scripts/seed-galeria.mjs egito    (só uma)
 */
import { createClient } from "@sanity/client"
import { readFileSync, createReadStream } from "node:fs"
import { join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"

const SITE = join(dirname(fileURLToPath(import.meta.url)), "..")
const REPO = join(SITE, "..")

const env = Object.fromEntries(
  readFileSync(join(SITE, ".env.local"), "utf8")
    .split(/\r?\n/).filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^"|"$/g, "")]),
)

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
})

const key = () => Math.random().toString(36).slice(2, 10)

async function imagem({ arquivo, hotspot }) {
  const asset = await client.assets.upload("image", createReadStream(join(REPO, arquivo)), {
    filename: `${basename(dirname(arquivo))}-${basename(arquivo)}`,
  })
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    ...(hotspot ? { hotspot: { _type: "sanity.imageHotspot", ...hotspot } } : {}),
  }
}

async function seed(v) {
  const existente = await client.fetch(
    `*[_type == "viagemRealizada" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug: v.slug },
  )
  const id = existente ?? `viagem-${v.slug}`
  console.log(`\n→ ${v.titulo} — ${v.fotos.length} fotos → drafts.${id}`)

  const fotos = []
  for (const f of v.fotos) {
    fotos.push({ ...(await imagem(f)), _key: key(), ...(f.legenda ? { legenda: f.legenda } : {}) })
    process.stdout.write(".")
  }
  const { _key, legenda, ...capa } = fotos[0]   // capa = 1ª foto (sem os campos do item de lista)

  await client.createOrReplace({
    _id: `drafts.${id}`,
    _type: "viagemRealizada",
    titulo: v.titulo,
    slug: { _type: "slug", current: v.slug },
    local: v.local,
    capa,
    fotos,
  })
  console.log(`\n  ✓ rascunho salvo${existente ? " sobre a viagem já publicada" : ""}`)
}

const filtro = process.argv[2]
const viagens = JSON.parse(readFileSync(join(SITE, "scripts", "data", "galeria.json"), "utf8"))
for (const v of viagens.filter((x) => !filtro || x.slug === filtro)) await seed(v)
console.log("\nPronto. Revise e publique em /admin → Viagens realizadas.")
