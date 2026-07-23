"use client"

export const dynamic = "force-dynamic"

import dynamic_import from "next/dynamic"

const NextStudio = dynamic_import(
  () => import("next-sanity/studio").then(m => m.NextStudio),
  { ssr: false }
)

import config from "@/sanity.config"

export default function AdminPage() {
  return <NextStudio config={config} scheme="light" />
}
