import type { ObjectInputProps, ObjectMember } from "sanity"

function isFilled(v: unknown): boolean {
  if (v === null || v === undefined) return false
  if (typeof v === "string") return v.trim() !== ""
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === "object") return Object.keys(v as object).length > 0
  return true // number, boolean
}

type FieldMember = Extract<ObjectMember, { kind: "field" }>

/**
 * Wrapper do formulário do documento: mostra uma barra de progresso da
 * ABA ATIVA (campos preenchidos / total), acima dos campos.
 * Usa props.members, que no Sanity já vêm filtrados pelo grupo selecionado.
 */
export function DocProgress(props: ObjectInputProps) {
  const fields = (props.members ?? []).filter(
    (m): m is FieldMember => m.kind === "field",
  )
  const total = fields.length
  const filled = fields.filter((m) => isFilled(m.field.value)).length
  const pct = total ? Math.round((filled / total) * 100) : 0
  const selected = props.groups?.find((g) => g.selected)
  const label = selected?.title ?? "Preenchimento"
  const done = pct === 100
  const color = done ? "#1a8a48" : "#0d1f30"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {total > 0 && (
        <div
          style={{
            border: "1px solid rgba(13,31,48,0.12)",
            borderRadius: 10,
            padding: "12px 14px",
            background: "rgba(13,31,48,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              fontSize: 13,
              color: "#3d5a6e",
              fontWeight: 500,
            }}
          >
            <span>{label} — preenchimento</span>
            <span style={{ fontWeight: 700, color }}>{filled}/{total} · {pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(13,31,48,0.10)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: color, transition: "width .3s ease" }} />
          </div>
        </div>
      )}
      {props.renderDefault(props)}
    </div>
  )
}
