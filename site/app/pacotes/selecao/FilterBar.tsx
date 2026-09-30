"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const CONTINENTES = [
  { label: "Todos",            value: ""                },
  { label: "África",           value: "africa"          },
  { label: "América do Norte", value: "america-norte"   },
  { label: "América do Sul",   value: "america-sul"     },
  { label: "América Central",  value: "america-central" },
  { label: "Ásia",             value: "asia"            },
  { label: "Europa",           value: "europa"          },
]

const TIPOS = [
  { label: "Todos os tipos",    value: ""                  },
  { label: "Grupo do Ruas",     value: "gruposDoRuas"      },
  { label: "Pacotes Assinados", value: "assinadoByRuas"    },
]

const chipBase = `px-5 py-2.5 rounded-full text-[20px] font-semibold uppercase tracking-[0.1em]
                  border transition-all duration-200 cursor-pointer`
const chipActive   = "bg-white text-[#060F18] border-white"
const chipInactive = "bg-transparent text-white/60 border-white/20 hover:border-white/60 hover:text-white"

export function FilterBar() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const currentCont  = searchParams.get("continente") ?? ""
  const currentTipo  = searchParams.get("tipo")       ?? ""

  function selectContinente(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("continente", value)
    else        params.delete("continente")
    router.push(`${pathname}?${params.toString()}`)
  }

  function selectTipo(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("tipo", value)
    else        params.delete("tipo")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="px-[clamp(20px,5vw,80px)] pt-4 pb-8 flex flex-col gap-5">

      {/* ── Continente ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/35">
          Continente
        </span>
        <div className="flex flex-wrap gap-2">
          {CONTINENTES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => selectContinente(value)}
              aria-pressed={currentCont === value}
              className={`${chipBase} ${currentCont === value ? chipActive : chipInactive}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tipo de pacote ─────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/35">
          Tipo de pacote
        </span>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => selectTipo(value)}
              aria-pressed={currentTipo === value}
              className={`${chipBase} ${currentTipo === value ? chipActive : chipInactive}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

