# Handoff — RR Viagens

**Repositório:** https://github.com/orbssexp/rodrigo-ruas  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · GSAP + Lenis · Sanity CMS v5  
**Atualizado em:** 08/10/2026 (último commit de código: `d3ca4c5`, 30/09/2026)

---

## 0. Estado atual em 1 minuto

- O site roda com **9 pacotes** no Sanity, cadastrados a partir dos PDFs oficiais 2026/2027:
  - **Grupos do Ruas** (Rodrigo vai junto): África do Sul, Dolomitas
  - **Pacotes Assinados / privativos** (saída a qualquer data): Egito, Egito e Jordânia, Grécia, Puglia, Puglia e Grécia, Turquia com Capadócia, Turquia e Grécia
- O tipo **Grupos Brasileiros** já saiu do código, do schema e dos filtros. Ainda sobra texto sobre "grupos" no site (veja o backlog).
- Página **Viagens realizadas** (`/viagens-realizadas`) no ar, com 4 viagens cadastradas.
- Página do pacote mostra o **roteiro dia a dia** (`RoteiroDias`) e um **ticket de preço** (`PricingTicket`).
- No Studio: navbar com botão "Ver site", **exclusão de vários pacotes de uma vez** e um **guia de uso em slides**.
- **Ainda não tem deploy.**
- **Próximos passos:** seção 9 (backlog). Cada item vira uma issue no GitHub.

---

## 1. Estrutura do repositório

```
rodrigo-ruas/
├── HANDOFF.md                 ← este arquivo
├── _docs/                     ← referências, brand, design system, conteúdo antigo raspado
├── imgs/                      ← fotos-fonte (pacotes-2026/<slug>/, galeria/<slug>/, ...)
└── site/                      ← projeto Next.js
    ├── app/
    │   ├── page.tsx                 ← Homepage
    │   ├── pacotes/selecao/         ← Listagem com filtros (FilterBar, FilterPanel, PriceCalculator)
    │   ├── pacotes/[slug]/          ← Página do pacote (roteiro por dias + PricingTicket)
    │   ├── viagens-realizadas/      ← Galeria de viagens passadas (+ [slug] com fotos)
    │   ├── sobre/ · contato/ · obrigado/
    │   ├── style-guide/             ← Referência visual dos tokens/tipografia
    │   ├── admin/[[...tool]]/       ← Sanity Studio embutido
    │   └── api/
    │       ├── submit-form/         ← Recebe o formulário → manda ao webhook
    │       └── destinos/            ← Pacotes por tipo (step 3 do form)
    ├── components/
    │   ├── FormModal.tsx / FormProvider.tsx / BtnForm.tsx  ← Formulário multi-step (drawer)
    │   ├── RoteiroDias.tsx · PricingTicket.tsx · DestinosSection.tsx · DestinosModal.tsx
    │   └── gsap/                    ← NavBar, MobileMenu, HeroSection, PackagesReel, animações
    ├── sanity/
    │   ├── schemaTypes/             ← pacote, viagemRealizada, homepage, formulario
    │   ├── components/              ← GuiaDoc, StudioNavbar, BulkDeletePacotes, DocProgress...
    │   └── lib/queries.ts           ← Queries GROQ
    └── scripts/                     ← seeds e utilitários (ver seção 7)
```

---

## 2. Setup local (qualquer máquina)

```bash
git clone https://github.com/orbssexp/rodrigo-ruas.git
cd rodrigo-ruas/site
npm install
cp .env.local.example .env.local   # preencher (ver abaixo)
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin  (Sanity Studio)
```

### Variáveis de ambiente (`site/.env.local`, gitignored)

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `6g3tj20r` | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | ✅ |
| `SITE_USUARIO` / `SITE_SENHA` | Previstas para proteger o `/admin`, **mas nenhum código usa hoje** (ver seção 8) | — |
| `SANITY_TOKEN` | Token com permissão de escrita, usado só pelos scripts | Só para scripts |

> O `.env.local` **não vai pelo git**. Para trabalhar em outra máquina, copie o arquivo por um canal seguro.

---

## 3. Fluxo de trabalho (2 máquinas + issues)

- **Backlog = GitHub Issues.** Cada mudança ou feedback de QA vira uma issue. Labels: `qa`, `bug`, `feature`, `conteudo`, `design`, `mobile`, `cms`.
- **1 issue = 1 branch:** `tipo/<nº>-descricao` (ex.: `feat/7-secao-viagens-passadas`). Commit/PR com `Closes #7`.
- **Ao trocar de máquina:** `git push` na máquina atual e `git pull` na outra. Não mexa na mesma branch nas duas ao mesmo tempo.
- **Não sincronize a pasta do repo** (`.git`, `node_modules`, `.next`) com ferramenta de sync de arquivos. O código vai e volta pelo git.
- **O Sanity é compartilhado.** As duas máquinas e o site usam o mesmo dataset `production`. Seed, exclusão em massa e publicação afetam tudo na hora. Para testar schema ou dados, crie um dataset `dev`.
- A memória e o histórico do Claude Code ficam em cada máquina. O contexto que precisa viajar fica **neste arquivo e nas issues**.

---

## 4. CMS — Sanity

**Acesso:** `/admin` · **Project ID:** `6g3tj20r` · **Dataset:** `production`

| Tipo | O que controla |
|------|---------------|
| `pacote` | Cada destino. Abas: Básico, Rota & Datas, Investimento, Termos, Conteúdo (roteiro por dias, galeria), SEO |
| `viagemRealizada` | Cada viagem da galeria `/viagens-realizadas` (capa, local, data, resumo, fotos) |
| `homepage` | Hero (textos + slides), números, processo, títulos das seções, depoimento, CTA, foto do Rodrigo |
| `formulario` | Webhook, campos, textos e cards de programa do formulário |

### Campo `tipo` do pacote

| Valor | Label | Onde aparece |
|-------|-------|--------------|
| `gruposDoRuas` | Grupos do Ruas | Seção 1 da home (card destaque + carrossel), filtro, form step 3 |
| `assinadoByRuas` | Pacotes Assinados (privativos) | Seção 2 da home (grid), filtro, form step 3 |

O mesmo campo controla o badge na listagem, o filtro "Tipo" em `/pacotes/selecao`, os pacotes que aparecem no step 3 do formulário e a whitelist em `api/destinos`.

### Campo `prioridade`

`destaque` vira o card grande no topo da seção, `carrossel` entra na rolagem lateral e `oculto` não aparece na home. O campo `ordem` define a posição no carrossel.

---

## 5. Formulário de contato

Drawer lateral em 3 etapas:

```
Step 1 → Dados pessoais   (campos vindos do Sanity; telefone com react-international-phone, padrão +55)
Step 2 → Programa         (Grupos do Ruas / Pacotes Assinados)
Step 3 → Destino          (checkboxes via /api/destinos?tipo={programa})
```

Quando o form é aberto a partir de uma página de pacote, o programa e o destino já vêm marcados.

**Payload do webhook (nomes fixos, não alterar):**

```json
{ "nome": "...", "telefone": "+5511999999999", "email": "...",
  "destino_programa": "gruposDoRuas", "destino": "Egito, Grécia" }
```

A URL do webhook fica no Sanity (`formulario.webhookUrl`). Quem lê essa URL é a rota `/api/submit-form`, no servidor, então ela nunca chega ao browser.

---

## 6. Navegação e filtros

**NavBar:** Destinos (abre um modal) · Galeria (`/viagens-realizadas`) · Sobre · Contato · botão WhatsApp (abre o form)

**`/pacotes/selecao`:** filtros por URL que podem ser combinados: `?continente=Asia&tipo=gruposDoRuas&precoMax=15000`

---

## 7. Scripts (`site/scripts/`)

Rodar de dentro de `site/` com `SANITY_TOKEN` no ambiente.

| Script | O que faz |
|--------|-----------|
| `seed-pacotes-2026.mjs [slug] [--dry]` | **Atual.** Cadastra os pacotes 2026/2027 a partir de `data/pacotes-2026.json` + fotos em `imgs/pacotes-2026/<slug>/` (00 = hero). Grava como **rascunho**, que precisa ser publicado no Studio |
| `seed-galeria.mjs [slug]` | Cadastra as viagens realizadas a partir de `data/galeria.json` + `imgs/galeria/<slug>/`. Também grava como rascunho |
| `upload-fotos.mjs` | Sobe hero e galeria de pacotes |
| `test-token.mjs` | Testa o token |
| `seed-completo.mjs`, `seed-pacotes.mjs`, `seed-itinerarios.mjs`, `pacotes-seed.ndjson` | **Legado**: conteúdo antigo do site pacotespelomundo. Não rode em `production` |

**Fonte dos pacotes atuais:** PDFs da Ludmilla (Egito, Egito e Jordânia, Grécia, Puglia, Puglia e Grécia, Turquia com Capadócia, Turquia e Grécia, Dolomitas 2027, África do Sul v3). Estão fora do repo, em `Downloads/PACOTES NOVOS LUDMILLA` (86 MB). O texto deles já foi extraído para `data/pacotes-2026.json`.

---

## 8. Segurança e pendências

- ✅ O token Sanity não está no código, só no `.env.local`.
- ✅ A URL do webhook não chega ao browser, e `/api/submit-form` ignora `_webhookUrl` vindo do cliente.
- ✅ `/api/destinos` valida `tipo` contra uma whitelist.
- ⚠️ **O `/admin` não tem login próprio.** Não existe middleware e `SITE_USUARIO`/`SITE_SENHA` não são lidos por nenhum código. Quem protege é só o login do Sanity (é preciso ser membro do projeto para editar). Decidir se isso basta antes de ir para produção.
- ⚠️ **Token antigo no histórico do git.** Um token Sanity antigo (`skTMByody...`) aparece em commits antigos. Para resolver: sanity.io/manage → `6g3tj20r` → API → Tokens → revogar o antigo e criar um novo com permissão de escrita. Guarde o novo só no `.env.local` e compartilhe por canal seguro.
- ⚠️ **Sem deploy.** A recomendação é Vercel (`npx vercel --prod` dentro de `site/`), com as variáveis configuradas no painel.

---

## 9. Backlog (out/2026). Cada item vira uma issue

1. **Remover tudo sobre grupos, exceto Grupos do Ruas.** A empresa não faz mais grupos de brasileiros. O tipo já saiu do código; falta revisar os textos que ainda falam de "grupos" de forma genérica (`sobre/page.tsx`, títulos e cópia da home, cards do form, `"X por grupo"` na página do pacote) e garantir que não sobrou nenhum documento ou cópia no Sanity.
2. **Nova seção na home: "Viagens passadas" ou relacionados.** Pode reaproveitar `viagemRealizada` (já existe, com 4 cadastradas) ou mostrar pacotes relacionados.
3. **Atualizar o conteúdo do site para o que estão vendendo e divulgando hoje.** Conferir os 9 pacotes contra as versões mais recentes dos PDFs (os nomes dos arquivos têm números de versão, então pode ter mudado alguma coisa), além de hero, números, depoimento, Sobre e CTA. Destacar os privativos como produto principal.
4. **Refinar design e interação no desktop.**
5. **Refinar design e interação no mobile.**

---

## 10. Contato

Dúvidas sobre o projeto: **gustavoalves@botconversa.com.br**
