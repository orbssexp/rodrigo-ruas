/**
 * Cadastra no Sanity os pacotes de 2026/2027 a partir dos PDFs oficiais.
 *
 * Dados:  scripts/data/pacotes-2026.json   (texto dos PDFs + campos conferidos à mão)
 * Fotos:  imgs/pacotes-2026/<slug>/NN.jpg  (00 = hero, demais = galeria)
 *
 * - Grava como RASCUNHO: nada entra no ar até alguém publicar no Studio.
 * - Se já existe um pacote PUBLICADO com o mesmo slug, o rascunho vai em cima
 *   dele (drafts.<id existente>) — não cria pacote duplicado; é só publicar.
 * - Pode rodar de novo: substitui o rascunho do mesmo slug.
 *
 * Uso:  node scripts/seed-pacotes-2026.mjs           (todos)
 *       node scripts/seed-pacotes-2026.mjs egito     (só um slug)
 *       node scripts/seed-pacotes-2026.mjs --dry     (mostra sem gravar)
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
const block = (text) => ({
  _type: "block", _key: key(), style: "normal", markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
})

async function subirFoto(caminho) {
  const asset = await client.assets.upload("image", createReadStream(join(REPO, caminho)), {
    filename: `${basename(dirname(caminho))}-${basename(caminho)}`,
  })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

async function seed(p, dry) {
  const { fotos, intro, itinerario, slug, ...campos } = p

  /* reaproveita o id de um pacote já publicado com o mesmo slug */
  const existente = await client.fetch(
    `*[_type == "pacote" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug },
  )
  const id = existente ?? `pacote-${slug}`
  console.log(`\n→ ${p.titulo} (${p.tipo}) — ${itinerario.length} dias, ${fotos.length} fotos → drafts.${id}`)
  if (dry) return

  const imagens = []
  for (const f of fotos) {
    imagens.push(await subirFoto(f))
    process.stdout.write(".")
  }
  const [hero, ...galeria] = imagens

  const doc = {
    ...campos,
    _id: `drafts.${id}`,
    _type: "pacote",
    slug: { _type: "slug", current: slug },
    aeroportoPartida: "GRU",
    dias: p.dias ?? itinerario.length,
    heroImage: hero,
    galeria: galeria.map((g) => ({ ...g, _key: key() })),
    intro: intro.length ? intro.map(block) : undefined,
    itinerario: itinerario.map((d) => ({
      _type: "dia", _key: key(),
      numero: d.numero,
      titulo: d.titulo,
      resumo: d.resumo || undefined,
      passeios: d.passeios?.length ? d.passeios : undefined,
      refeicoes: d.refeicoes || undefined,
      hospedagem: d.hospedagem || undefined,
      opcionais: d.opcionais?.length ? d.opcionais : undefined,
      observacao: d.observacao || undefined,
    })),
  }

  const tx = client.transaction().createOrReplace(doc)
  /* se havia um rascunho separado para este slug, remove (evita duplicado) */
  if (id !== `pacote-${slug}`) tx.delete(`drafts.pacote-${slug}`)
  await tx.commit()
  console.log(`\n  ✓ rascunho salvo${existente ? " sobre o pacote já publicado" : ""}`)
}

const args = process.argv.slice(2)
const dry = args.includes("--dry")
const filtro = args.find((a) => !a.startsWith("--"))
const pacotes = JSON.parse(readFileSync(join(SITE, "scripts", "data", "pacotes-2026.json"), "utf8"))

for (const p of pacotes.filter((x) => !filtro || x.slug === filtro)) await seed(p, dry)
if (!dry) console.log("\nPronto. Revise e publique em /admin → Pacotes.")
