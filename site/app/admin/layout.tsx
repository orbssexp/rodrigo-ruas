import { StudioTweaks } from "./StudioTweaks"

/**
 * Layout do Sanity Studio. O SmoothScroll (Lenis) do site já é ignorado
 * em /admin (ver components/gsap/SmoothScroll.tsx).
 * StudioTweaks ajusta a UI: esconde a aba "All fields" e alarga o form.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioTweaks />
      {children}
    </>
  )
}
