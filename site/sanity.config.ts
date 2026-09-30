import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schema } from "./sanity/schema"
import { GuiaDoc } from "./sanity/components/GuiaDoc"
import { withPublishNotice } from "./sanity/components/publishNotice"
import { BulkDeleteHost, ABRIR_EXCLUSAO_EM_MASSA } from "./sanity/components/BulkDeletePacotes"
import { StudioNavbar } from "./sanity/components/StudioNavbar"
import { PACOTE_SORTS } from "./sanity/schemaTypes/pacote"
import { VIAGEM_SORTS } from "./sanity/schemaTypes/viagemRealizada"
import { SortAscending, Trash } from "@phosphor-icons/react/dist/ssr"

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
            /* Pacotes — lista normal, mas com só 4 ordenações (tipo, data,
               nome, continente) em vez de "Sort by" para todos os campos */
            S.documentTypeListItem("pacote")
              .title("Pacotes")
              .child(
                S.documentTypeList("pacote")
                  .title("Pacotes")
                  .defaultOrdering(PACOTE_SORTS[0].by.map((b) => ({ ...b })))
                  .menuItems([
                    ...PACOTE_SORTS.map(({ name, title, by }) =>
                      S.menuItem()
                        .id(`sort-${name}`)
                        .title(`Ordenar por ${title}`)
                        .group("sorting")
                        .icon(SortAscending)
                        .action("setSortOrder")
                        .params({ by: by.map((b) => ({ ...b })) }),
                    ),
                    /* abre a janela de seleção múltipla (BulkDeleteHost) */
                    S.menuItem()
                      .title("Selecionar vários (publicar ou excluir)")
                      .group("actions")
                      .icon(Trash)
                      .action(() => window.dispatchEvent(new Event(ABRIR_EXCLUSAO_EM_MASSA))),
                  ]),
              ),
            S.divider(),
            /* Viagens realizadas — galeria /viagens-realizadas */
            S.documentTypeListItem("viagemRealizada")
              .title("Viagens realizadas")
              .child(
                S.documentTypeList("viagemRealizada")
                  .title("Viagens realizadas")
                  .defaultOrdering(VIAGEM_SORTS[0].by.map((b) => ({ ...b })))
                  .menuItems(
                    VIAGEM_SORTS.map(({ name, title, by }) =>
                      S.menuItem()
                        .id(`sort-${name}`)
                        .title(`Ordenar por ${title}`)
                        .group("sorting")
                        .icon(SortAscending)
                        .action("setSortOrder")
                        .params({ by: by.map((b) => ({ ...b })) }),
                    ),
                  ),
              ),
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

  studio: {
    components: {
      layout: BulkDeleteHost, /* janela de "Selecionar e excluir vários" pacotes */
      navbar: StudioNavbar,   /* botão "Ver site" no topo */
    },
  },

  schema,
})
