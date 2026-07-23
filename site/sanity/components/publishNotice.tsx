import { useState } from "react"
import type { DocumentActionComponent, DocumentActionDescription } from "sanity"

/**
 * Envolve a ação de "Publish" para, ao publicar, mostrar um pop-up avisando
 * que a alteração pode levar alguns minutos para aparecer no site (ISR/cache).
 */
export function withPublishNotice(original: DocumentActionComponent): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const desc: DocumentActionDescription | null = original(props)
    const [notice, setNotice] = useState(false)
    if (!desc) return desc

    return {
      ...desc,
      onHandle: () => {
        desc.onHandle?.()
        setNotice(true)
      },
      dialog: notice
        ? {
            type: "dialog",
            header: "✅ Mudanças publicadas",
            onClose: () => setNotice(false),
            content: (
              <div style={{ padding: 16, fontSize: 15, lineHeight: 1.5, color: "#0d1f30" }}>
                Suas alterações foram publicadas com sucesso.
                <br />
                <br />
                <strong>Aguarde até 10 minutos</strong> para que elas apareçam no
                site — o conteúdo é atualizado automaticamente.
              </div>
            ),
          }
        : desc.dialog,
    }
  }
  Wrapped.action = original.action
  return Wrapped
}
