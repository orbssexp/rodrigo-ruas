"use client"

/* Barra do topo do Studio + botão "Ver site" (abre a home em nova aba,
   pra não perder o que está sendo editado no CMS). */

import type { NavbarProps } from "sanity"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"

const NAVY = "#0D1F30"
const FONT = '"DM Sans", system-ui, -apple-system, sans-serif'

export function StudioNavbar(props: NavbarProps) {
  return (
    <div style={{ display: "flex", alignItems: "stretch" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{props.renderDefault(props)}</div>
      <div
        style={{
          display: "flex", alignItems: "center", padding: "0 12px",
          borderBottom: "1px solid var(--card-border-color, #E6E8EC)",
          background: "var(--card-bg-color, #fff)",
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Abre o site em uma nova aba"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
            fontFamily: FONT, fontSize: 14, fontWeight: 700, textDecoration: "none",
            padding: "8px 16px", borderRadius: 999, background: NAVY, color: "#fff",
          }}
        >
          <ArrowSquareOut size={16} weight="bold" />
          Ver site
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff" }} />
        </a>
      </div>
    </div>
  )
}
