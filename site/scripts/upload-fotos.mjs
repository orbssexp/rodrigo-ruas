/**
 * Upload de fotos reais para o Sanity.
 * Roda com: node scripts/upload-fotos.mjs
 *
 * - hero.jpg de cada pasta → heroImage do pacote
 * - demais fotos → galeria do pacote (itinerário)
 */
import { createClient } from "@sanity/client"
import { createReadStream, existsSync } from "fs"
import { basename, extname } from "path"

const client = createClient({
  projectId: "6g3tj20r",
  dataset:   "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     "skTMByodyxtOZHTjHhNJ0ZoGg81zpCQYsaWoeh2oteGTUMJqImOcSm2Gr2tnA0S06NbzF5PPvjCk7IOpk21lyvnf7SzBlNNuC8cUlgR954RzL6TgqcFaPi9lahIpKdaclOyJwWBYikxglc6pLn4PTBxEJIGLmM2ScD83p8lnA0I5Dj5biLKT",
})

const BASE = "D:/Donwloads/APPS/rodrigo-ruas/imgs"

/* Mapa: pasta → IDs dos pacotes que devem receber o hero */
const HERO_MAP = {
  "japao":   ["pacote-japao-out2026"],
  "coreia":  ["pacote-japao-coreia-out2026"],
  "grecia":  ["pacote-grecia-assinado"],
  "turquia": ["pacote-turquia-assinado"],
}

/* Mapa: pasta → IDs dos pacotes que recebem a galeria */
const GALERIA_MAP = {
  "japao":   ["pacote-japao-out2026", "pacote-japao-coreia-out2026"],
  "coreia":  ["pacote-japao-coreia-out2026"],
  "grecia":  ["pacote-grecia-assinado"],
  "turquia": ["pacote-turquia-assinado"],
}

const VALID_EXT = [".jpg", ".jpeg", ".png", ".avif", ".jfif", ".webp"]

async function uploadImage(filePath) {
  const filename = basename(filePath)
  console.log(`  ↑ upload: ${filename}`)
  const stream = createReadStream(filePath)
  const asset  = await client.assets.upload("image", stream, { filename })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

async function run() {
  const uploaded = {}  /* cache path → assetRef */

  for (const [pasta, pacoteIds] of Object.entries(HERO_MAP)) {
    const heroPath = `${BASE}/${pasta}/hero.jpg`
    if (!existsSync(heroPath)) { console.log(`⚠ sem hero: ${pasta}`); continue }

    console.log(`\n📁 ${pasta} — hero`)
    const ref = await uploadImage(heroPath)
    uploaded[heroPath] = ref

    for (const id of pacoteIds) {
      await client.patch(id).set({ heroImage: ref }).commit()
      console.log(`  ✓ heroImage → ${id}`)
    }
  }

  /* Galeria — fotos do itinerário (exceto hero.jpg) */
  const { readdirSync } = await import("fs")

  for (const [pasta, pacoteIds] of Object.entries(GALERIA_MAP)) {
    const dir = `${BASE}/${pasta}`
    if (!existsSync(dir)) continue

    const files = readdirSync(dir)
      .filter(f => VALID_EXT.includes(extname(f).toLowerCase()) && f !== "hero.jpg")

    if (!files.length) continue
    console.log(`\n📁 ${pasta} — galeria (${files.length} fotos)`)

    const galeria = []
    for (const file of files) {
      const path = `${dir}/${file}`
      if (uploaded[path]) {
        galeria.push(uploaded[path])
      } else {
        const ref = await uploadImage(path)
        uploaded[path] = ref
        galeria.push(ref)
      }
    }

    /* adiciona _key obrigatório do Sanity */
    const galeriaKeyed = galeria.map((img, i) => ({
      ...img,
      _key: `gal${i + 1}`,
    }))

    for (const id of pacoteIds) {
      await client.patch(id).set({ galeria: galeriaKeyed }).commit()
      console.log(`  ✓ galeria (${galeria.length}) → ${id}`)
    }
  }

  console.log("\n✅ Upload concluído!\n")
}

run().catch(console.error)
