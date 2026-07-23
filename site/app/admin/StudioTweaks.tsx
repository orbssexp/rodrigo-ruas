"use client"

import { useEffect } from "react"

/**
 * Ajuste de UI do Studio que não dá pra fazer via config:
 * esconde a aba "All fields" (acha pelo texto — robusto contra re-render da SPA).
 * (O "fill" da largura do form não é sobrescrevível de forma limpa — é fixo do Sanity.)
 */
export function StudioTweaks() {
  useEffect(() => {
    const apply = () => {
      document
        .querySelectorAll<HTMLElement>('[data-ui="Tab"], button[role="tab"], [role="tab"]')
        .forEach((t) => {
          if ((t.textContent || "").trim().toLowerCase() === "all fields") {
            t.style.display = "none"
          }
        })
    }
    apply()
    const obs = new MutationObserver(apply)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => obs.disconnect()
  }, [])

  return null
}
