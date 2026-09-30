import { type SchemaTypeDefinition } from "sanity"
import { pacote }          from "./schemaTypes/pacote"
import { homepage }        from "./schemaTypes/homepage"
import { formulario }      from "./schemaTypes/formulario"
import { viagemRealizada } from "./schemaTypes/viagemRealizada"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pacote, homepage, formulario, viagemRealizada],
}
