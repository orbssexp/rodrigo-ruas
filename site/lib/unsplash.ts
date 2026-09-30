/**
 * Imagens Unsplash por slug de destino — usadas como fallback
 * enquanto o Sanity não tem imagem real cadastrada.
 */
const BASE = "https://images.unsplash.com"

export const UNSPLASH: Record<string, string> = {
  /* ── Destinos principais ─────────────────────────────── */
  japao:          `${BASE}/photo-aqZ3UAjs_M4?w=1200&q=80&fm=webp&fit=crop`,
  grecia:         `${BASE}/photo-1555993539-1732b0258235?w=1200&q=80&fm=webp&fit=crop`,
  turquia:        `${BASE}/photo-1524231757912-21f4fe3a7200?w=1200&q=80&fm=webp&fit=crop`,
  egito:          `${BASE}/photo-1568322445389-f64ac2515020?w=1200&q=80&fm=webp&fit=crop`,
  islandia:       `${BASE}/photo-1476610182048-b716b8518aae?w=1200&q=80&fm=webp&fit=crop`,
  marrocos:       `${BASE}/photo-1500530855697-b586d89ba3ee?w=1200&q=80&fm=webp&fit=crop`,
  tailandia:      `${BASE}/photo-1528181304800-259b08848526?w=1200&q=80&fm=webp&fit=crop`,
  portugal:       `${BASE}/photo-1555881400-74d7acaacd8b?w=1200&q=80&fm=webp&fit=crop`,
  peru:           `${BASE}/photo-1526392060635-9d6019884377?w=1200&q=80&fm=webp&fit=crop`,
  alemanha:       `${BASE}/photo-1467269204594-9661b134dd2b?w=1200&q=80&fm=webp&fit=crop`,

  /* ── Novos destinos ─────────────────────────────────── */
  ushuaia:        `${BASE}/photo-1517736996303-4b1c7b4e4b5d?w=1200&q=80&fm=webp&fit=crop`,
  patagonia:      `${BASE}/photo-1517736996303-4b1c7b4e4b5d?w=1200&q=80&fm=webp&fit=crop`,
  china:          `${BASE}/photo-1547036967-23d11aacaee0?w=1200&q=80&fm=webp&fit=crop`,
  srilanka:       `https://cdn.sanity.io/images/6g3tj20r/production/5b31546fa200cb2b85a1e4d6ff04114cb1e5d4b3-5928x3957.jpg?w=1200&fit=crop&fm=webp&q=80`,
  maldivas:       `${BASE}/photo-1514282401047-d79a71a590e8?w=1200&q=80&fm=webp&fit=crop`,
  coreia:         `${BASE}/photo-1601121141461-9d6647bef0e8?w=1200&q=80&fm=webp&fit=crop`,
  croacia:        `${BASE}/photo-1555990793-da11153b6ec5?w=1200&q=80&fm=webp&fit=crop`,
  toscana:        `${BASE}/photo-1523906834658-6e24ef2386f9?w=1200&q=80&fm=webp&fit=crop`,
  puglia:         `${BASE}/photo-1558618666-fcd25c85cd64?w=1200&q=80&fm=webp&fit=crop`,
  dubai:          `${BASE}/photo-1512453979798-5ea266f8880c?w=1200&q=80&fm=webp&fit=crop`,
  india:          `${BASE}/photo-1524492412937-b28074a5d7da?w=1200&q=80&fm=webp&fit=crop`,
  indonesia:      `${BASE}/photo-1537996194471-e657df975ab4?w=1200&q=80&fm=webp&fit=crop`,
  canada:         `${BASE}/photo-1517935706615-2717063c2225?w=1200&q=80&fm=webp&fit=crop`,
  mexico:        `${BASE}/photo-1518638150340-f706e86654de?w=1200&q=80&fm=webp&fit=crop`,
  colombia:       `${BASE}/photo-1576072440767-fb5b509fe6e6?w=1200&q=80&fm=webp&fit=crop`,
  escandinavos:   `${BASE}/photo-1531366936337-7c912a4589a7?w=1200&q=80&fm=webp&fit=crop`,
  escocia:        `${BASE}/photo-1506377247377-2a5b3b417ebb?w=1200&q=80&fm=webp&fit=crop`,
  suica:          `${BASE}/photo-1506905925346-21bda4d32df4?w=1200&q=80&fm=webp&fit=crop`,
  irlanda:        `${BASE}/photo-1590089415225-401ed6f9db8e?w=1200&q=80&fm=webp&fit=crop`,
  africa:         `${BASE}/photo-1523805009345-7448845a9e53?w=1200&q=80&fm=webp&fit=crop`,
  kenya:          `${BASE}/photo-1516026672322-bc52d61a55d5?w=1200&q=80&fm=webp&fit=crop`,
  tanzânia:       `${BASE}/photo-1516026672322-bc52d61a55d5?w=1200&q=80&fm=webp&fit=crop`,
  argentina:      `${BASE}/photo-1505726585380-f65de9f92d1a?w=1200&q=80&fm=webp&fit=crop`,

  /* ── Pessoas / Hero ─────────────────────────────────── */
  hero:           `${BASE}/photo-1476514525535-07fb3b4ae5f1?w=1920&q=85&fm=webp&fit=crop`,
  rodrigo:        `/imgs/rodrigo-ruas.jpeg`,
}

/* ── Aliases para slugs compostos ───────────────────────── */
const ALIASES: Record<string, string> = {
  "japaocoreia":       "japao",
  "japaoecoreiadosul": "japao",
  "turquiaegrecia":    "turquia",
  "alemanhanorte":     "alemanha",
  "srilankaemaldivas": "srilanka",
  "srilankamaldivas":  "srilanka",
  "chinaoutubro":      "china",
  "chinaout":          "china",
  "ushuaiaago":        "ushuaia",
}

/** Retorna URL Unsplash pelo slug, ou null se não encontrado */
export function getUnsplash(slug: string, size: "sm" | "md" | "lg" = "md"): string | null {
  const w = { sm: 600, md: 900, lg: 1400 }[size]
  const key = slug.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "")
  const resolved = UNSPLASH[key] ?? UNSPLASH[ALIASES[key] ?? ""] ?? null
  if (!resolved) return null
  return resolved.replace("w=1200", `w=${w}`)
}
