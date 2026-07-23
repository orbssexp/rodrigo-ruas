import type { FieldProps } from "sanity"
import { useFormValue } from "sanity"

/**
 * Fábrica de "field component" do Sanity que mostra, logo abaixo do campo,
 * um recorte real da área do site onde aquele conteúdo aparece.
 * Uso no schema:  components: { field: areaPreview("/cms-preview/rota.png") }
 */
export function areaPreview(src: string, legenda = "Onde aparece no site") {
  function PreviewField(props: FieldProps) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {props.children}
        <div
          style={{
            border: "1px solid rgba(13,31,48,0.12)",
            borderRadius: 8,
            padding: 12,
            background: "rgba(13,31,48,0.03)",
          }}
        >
          <div style={{ fontSize: 12, color: "#6a7684", marginBottom: 8, fontWeight: 500 }}>
            📍 {legenda}
          </div>
          <img
            src={src}
            alt={legenda}
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 8,
              display: "block",
              border: "1px solid rgba(13,31,48,0.10)",
            }}
          />
        </div>
      </div>
    )
  }
  return PreviewField
}

/** Caixa com iframe AO VIVO de uma página do site (escalado, sem interação). */
function LiveEmbed({ path, legenda }: { path?: string; legenda: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(13,31,48,0.12)",
        borderRadius: 8,
        overflow: "hidden",
        background: "rgba(13,31,48,0.04)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6a7684", fontWeight: 500, padding: "8px 12px" }}>
        📍 {legenda} {path ? `(${path})` : ""}
      </div>
      {path ? (
        <div style={{ position: "relative", width: 640, maxWidth: "100%", height: 380, overflow: "hidden", background: "#0d1f30" }}>
          <iframe
            src={path}
            title="Preview da página"
            loading="lazy"
            style={{
              width: 1280,
              height: 760,
              border: 0,
              transform: "scale(0.5)",
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          />
        </div>
      ) : (
        <div style={{ padding: 12, fontSize: 13, color: "#6a7684" }}>
          Defina e publique o <strong>slug</strong> para ver o preview da página.
        </div>
      )}
    </div>
  )
}

/**
 * Field component do "hero" do PACOTE: embed ao vivo da página real por slug.
 * Abriu o Egito → hero do Egito; abriu o Japão → o do Japão.
 */
export function HeroLiveField(props: FieldProps) {
  const slug = useFormValue(["slug", "current"]) as string | undefined
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {props.children}
      <LiveEmbed path={slug ? `/pacotes/${slug}` : undefined} legenda="Hero — página real deste pacote" />
    </div>
  )
}

/** Factory: embed ao vivo de um caminho FIXO (ex: "/" para a Homepage). */
export function livePreviewField(path: string, legenda: string) {
  function LivePreviewField(props: FieldProps) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {props.children}
        <LiveEmbed path={path} legenda={legenda} />
      </div>
    )
  }
  return LivePreviewField
}
