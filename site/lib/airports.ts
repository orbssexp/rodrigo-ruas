/**
 * Lista curada de aeroportos usados pela RR Viagens.
 * Fonte ÚNICA de verdade: alimenta o dropdown do CMS (schema pacote)
 * e o front (para exibir "São Paulo (GRU)" no ticket de pricing).
 *
 * Para adicionar um destino novo, basta incluir uma linha aqui.
 */

export interface Airport {
  code: string   // IATA — o que é salvo no Sanity
  city: string   // nome exibido no site
  country: string
}

export const AIRPORTS: Airport[] = [
  /* ── Partidas no Brasil ─────────────────────────────── */
  { code: "GRU", city: "São Paulo",     country: "Brasil" },
  { code: "CGH", city: "São Paulo",     country: "Brasil" },
  { code: "GIG", city: "Rio de Janeiro", country: "Brasil" },
  { code: "SDU", city: "Rio de Janeiro", country: "Brasil" },
  { code: "BSB", city: "Brasília",      country: "Brasil" },
  { code: "CNF", city: "Belo Horizonte", country: "Brasil" },
  { code: "POA", city: "Porto Alegre",  country: "Brasil" },
  { code: "CWB", city: "Curitiba",      country: "Brasil" },
  { code: "REC", city: "Recife",        country: "Brasil" },
  { code: "SSA", city: "Salvador",      country: "Brasil" },
  { code: "FOR", city: "Fortaleza",     country: "Brasil" },

  /* ── Destinos ───────────────────────────────────────── */
  { code: "CAI", city: "Cairo",          country: "Egito" },
  { code: "ATH", city: "Atenas",         country: "Grécia" },
  { code: "JTR", city: "Santorini",      country: "Grécia" },
  { code: "IST", city: "Istambul",       country: "Turquia" },
  { code: "USH", city: "Ushuaia",        country: "Argentina" },
  { code: "EZE", city: "Buenos Aires",   country: "Argentina" },
  { code: "JNB", city: "Joanesburgo",    country: "África do Sul" },
  { code: "CPT", city: "Cidade do Cabo", country: "África do Sul" },
  { code: "VCE", city: "Veneza",         country: "Itália" },
  { code: "MXP", city: "Milão",          country: "Itália" },
  { code: "FCO", city: "Roma",           country: "Itália" },
  { code: "BDS", city: "Brindisi",       country: "Itália" },
  { code: "BRI", city: "Bari",           country: "Itália" },
  { code: "AMM", city: "Amã",            country: "Jordânia" },
  { code: "CDG", city: "Paris",          country: "França" },
  { code: "LIS", city: "Lisboa",         country: "Portugal" },
  { code: "OPO", city: "Porto",          country: "Portugal" },
  { code: "MAD", city: "Madri",          country: "Espanha" },
  { code: "BCN", city: "Barcelona",      country: "Espanha" },
  { code: "LHR", city: "Londres",        country: "Reino Unido" },
  { code: "AMS", city: "Amsterdã",       country: "Holanda" },
  { code: "JFK", city: "Nova York",      country: "EUA" },
  { code: "MCO", city: "Orlando",        country: "EUA" },
  { code: "DXB", city: "Dubai",          country: "Emirados Árabes" },
  { code: "BKK", city: "Bangkok",        country: "Tailândia" },
  { code: "NRT", city: "Tóquio",         country: "Japão" },
  { code: "CUZ", city: "Cusco",          country: "Peru" },
  { code: "CUN", city: "Cancún",         country: "México" },
]

/** Opções no formato do Sanity (options.list). */
export const AIRPORT_OPTIONS = AIRPORTS.map((a) => ({
  title: `${a.code} — ${a.city} (${a.country})`,
  value: a.code,
}))

const BY_CODE = new Map(AIRPORTS.map((a) => [a.code, a]))

export function airportByCode(code?: string | null): Airport | undefined {
  if (!code) return undefined
  return BY_CODE.get(code)
}

/** Nome da cidade a partir do código; cai no próprio código se não achar. */
export function airportCity(code?: string | null): string {
  if (!code) return ""
  return BY_CODE.get(code)?.city ?? code
}
