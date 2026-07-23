import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schema } from "./sanity/schema"
import { GuiaDoc } from "./sanity/components/GuiaDoc"
import { withPublishNotice } from "./sanity/components/publishNotice"

const HOMEPAGE_ID = "singleton-homepage"

export default defineConfig({
  name:    "rr-viagens",
  title:   "RR Viagens — Admin",
  basePath: "/admin",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Conteúdo")
          .items([
            /* Homepage — singleton, abre direto sem lista */
            S.listItem()
              .title("Homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId(HOMEPAGE_ID)
                  .title("Homepage")
              ),
            S.divider(),
            /* Formulário — singleton */
            S.listItem()
              .title("Formulário de Contato")
              .child(
                S.document()
                  .schemaType("formulario")
                  .documentId("singleton-formulario")
                  .title("Formulário de Contato")
              ),
            S.divider(),
            /* Pacotes — lista normal */
            S.documentTypeListItem("pacote").title("Pacotes"),
            S.divider(),
            /* Grupos WhatsApp */
            S.documentTypeListItem("grupoWhatsapp").title("Grupos WhatsApp"),
            S.divider(),
            /* Documentação */
            S.listItem()
              .title("Como usar o CMS")
              .child(
                S.component(GuiaDoc).title("Como usar o CMS")
              ),
          ]),
    }),
    visionTool(),
  ],

  /* pop-up ao publicar avisando do tempo de propagação no site */
  document: {
    actions: (prev) =>
      prev.map((a) => (a.action === "publish" ? withPublishNotice(a) : a)),
  },

  schema,
})
