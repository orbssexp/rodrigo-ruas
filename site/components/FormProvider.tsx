"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { FormModal } from "./FormModal"

/* ─── Context ────────────────────────────────────────────── */
interface FormContextValue {
  openForm: (pacote?: string, tipo?: string) => void
  closeForm: () => void
}

const FormContext = createContext<FormContextValue>({
  openForm:  () => {},
  closeForm: () => {},
})

export function useForm() {
  return useContext(FormContext)
}

/* ─── Provider ───────────────────────────────────────────── */
interface FormProviderProps {
  children:   ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formConfig: any   /* vem do Sanity via server component */
}

export function FormProvider({ children, formConfig }: FormProviderProps) {
  const [isOpen,  setIsOpen]  = useState(false)
  const [pacote,  setPacote]  = useState<string | undefined>()
  const [tipo,    setTipo]    = useState<string | undefined>()

  const openForm  = (p?: string, t?: string) => { setPacote(p); setTipo(t); setIsOpen(true) }
  const closeForm = ()           => setIsOpen(false)

  /* Fallback se o Sanity não tiver formulário configurado ainda */
  const config = formConfig ?? {
    titulo:          "Quero conhecer os pacotes",
    descricao:       "Preencha os dados e nossa equipe entra em contato em até 1 hora.",
    webhookUrl:      "https://webhook.site/05afdd45-9989-4769-a5b6-3ab6ad79543c",
    mensagemSucesso: "Recebemos seus dados! Entraremos em contato em breve.",
    textoBotao:      "Quero ser contatado",
    campos: [
      { tipo: "input",  label: "Seu nome", nome: "nome",     placeholder: "João Silva",       obrigatorio: true  },
      { tipo: "phone",  label: "WhatsApp", nome: "telefone", placeholder: "(11) 9 9999-9999", obrigatorio: true  },
      { tipo: "email",  label: "E-mail",   nome: "email",    placeholder: "joao@email.com",   obrigatorio: false },
      {
        tipo: "programa-destino",
        label: "Programa de interesse",
        nome: "destino",
        obrigatorio: false,
        programas: [
          { valor: "gruposDoRuas",      titulo: "Grupos do Ruas",      descricao: "Viaje comigo — curadoria e guia exclusivo do Rodrigo" },
          { valor: "assinadoByRuas",    titulo: "Pacotes Assinados",   descricao: "Roteiros criados e validados por Rodrigo" },
        ],
      },
    ],
  }

  return (
    <FormContext.Provider value={{ openForm, closeForm }}>
      {children}
      <FormModal
        config={config}
        isOpen={isOpen}
        onClose={closeForm}
        pacote={pacote}
        tipo={tipo}
      />
    </FormContext.Provider>
  )
}
