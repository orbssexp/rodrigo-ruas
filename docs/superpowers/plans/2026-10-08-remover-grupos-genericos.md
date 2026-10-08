# Remover textos genéricos de "grupos" (manter só Grupos do Ruas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Garantir que nenhuma página ou texto do site/CMS fale em "grupos" de forma genérica — a única referência a produto em grupo deve ser "Grupos do Ruas".

**Architecture:** Edição de cópia (texto) em componentes React existentes e adição de lógica condicional baseada em `pacote.tipo` (`gruposDoRuas` vs `assinadoByRuas`) onde o texto "grupo" aparecia também para pacotes privativos. Nenhuma mudança de schema é necessária (já migrado em commit anterior).

**Tech Stack:** Next.js (App Router), TypeScript, Sanity CMS (GROQ).

**Spec:** GitHub issue orbssexp/rodrigo-ruas#1 — "Remover tudo sobre grupos (manter só Grupos do Ruas)"

## Global Constraints

- Nenhuma página pode falar em "grupos" fora do contexto do produto "Grupos do Ruas".
- Pacotes do tipo `assinadoByRuas` (privativos) nunca devem usar a palavra "grupo" para descrever vagas/capacidade — são viagens individuais/privativas.
- Não alterar o schema Sanity (`gruposBrasileiros` já foi removido em commit anterior — apenas confirmar dataset).

---

### Task 1: Revisar textos da página "Sobre" (`site/app/sobre/page.tsx`)

**Files:**
- Modify: `site/app/sobre/page.tsx:46` e `site/app/sobre/page.tsx:97`

**Problema:** o hero fala em "conduz grupos pelo mundo" e a seção de história fala em "grupos cuidadosamente planejados" — linguagem genérica que não existe mais como produto (só existe "Grupos do Ruas").

- [x] **Step 1: Trocar "conduz grupos pelo mundo" por referência explícita ao produto**

Em `site/app/sobre/page.tsx`, linha 46, trocar:
```tsx
Desde 2019, conduz grupos
pelo mundo e já levou mais de 1.500 pessoas a destinos que só ele conhece
como ninguém.
```
por:
```tsx
Desde 2019, lidera os Grupos do Ruas
pelo mundo e já levou mais de 1.500 pessoas a destinos que só ele conhece
como ninguém.
```

- [x] **Step 2: Trocar "grupos cuidadosamente planejados" por "roteiros cuidadosamente planejados"**

Em `site/app/sobre/page.tsx`, linha 97, trocar:
```tsx
ao redor do mundo — com grupos cuidadosamente planejados e vivências que não
existem em nenhum pacote de agência convencional.
```
por:
```tsx
ao redor do mundo — com roteiros cuidadosamente planejados e vivências que não
existem em nenhum pacote de agência convencional.
```

- [x] **Step 3: Verificar visualmente**

Run: `grep -n "grupo" site/app/sobre/page.tsx`
Expected: nenhuma ocorrência de "grupo" fora de contexto de marca (arquivo não deve ter mais nenhuma).

- [x] **Step 4: Commit**

```bash
git add site/app/sobre/page.tsx
git commit -m "docs(sobre): remove menção genérica a grupos, mantém só Grupos do Ruas"
```

---

### Task 2: Corrigir label genérico em `DestinosSection.tsx`

**Files:**
- Modify: `site/components/DestinosSection.tsx:132-136`

**Problema:** a fileira de cards da seção "Destinos" na home usa o label visível "Grupos de Viagem" (genérico) em vez de "Grupos do Ruas".

**Interfaces:**
- Nenhuma mudança de props — só texto estático dentro do JSX.

- [x] **Step 1: Trocar o label**

Em `site/components/DestinosSection.tsx`, trocar:
```tsx
{/* Fileira 1 — Grupos de Viagem */}
{gruposFiltrados.length > 0 && (
  <div className="mb-14">
    <ScrollReveal className="flex items-center justify-between mb-8">
      <p className="t-label">Grupos de Viagem</p>
```
por:
```tsx
{/* Fileira 1 — Grupos do Ruas */}
{gruposFiltrados.length > 0 && (
  <div className="mb-14">
    <ScrollReveal className="flex items-center justify-between mb-8">
      <p className="t-label">Grupos do Ruas</p>
```

- [x] **Step 2: Verificar**

Run: `grep -n "Grupos de Viagem" site/components/DestinosSection.tsx`
Expected: nenhuma ocorrência (comando não retorna nada).

- [x] **Step 3: Commit**

```bash
git add site/components/DestinosSection.tsx
git commit -m "fix(home): label da fileira de grupos vira Grupos do Ruas"
```

---

### Task 3: Corrigir "X por grupo" em pacotes privativos (`[slug]/page.tsx`)

**Files:**
- Modify: `site/app/pacotes/[slug]/page.tsx:107`

**Problema:** a barra de info mostra `"${vagas} por grupo"` independente do tipo do pacote. Para `assinadoByRuas` (pacote privativo, sem conceito de "grupo"), isso contradiz a proposta do produto.

**Interfaces:**
- Consome: `pacote.tipo` (já existe na interface `PacoteData`, valores `"gruposDoRuas" | "assinadoByRuas"`), `pacote.vagas` (`number | undefined`).

- [x] **Step 1: Tornar o texto condicional ao tipo**

Em `site/app/pacotes/[slug]/page.tsx`, trocar a linha:
```tsx
{ label: "Vagas",    value: pacote.vagas   ? `${pacote.vagas} por grupo` : "—" },
```
por:
```tsx
{ label: "Vagas",    value: pacote.vagas   ? `${pacote.vagas} ${pacote.tipo === "gruposDoRuas" ? "por grupo" : "pessoas"}` : "—" },
```

- [x] **Step 2: Verificar**

Run: `grep -n "por grupo" site/app/pacotes/\[slug\]/page.tsx`
Expected: a ocorrência restante deve estar dentro de uma expressão condicional (`pacote.tipo === "gruposDoRuas" ? "por grupo" : ...`), nunca incondicional.

- [x] **Step 3: Commit**

```bash
git add "site/app/pacotes/[slug]/page.tsx"
git commit -m "fix(pacote): vagas só mostra 'por grupo' para pacotes Grupos do Ruas"
```

---

### Task 4: Corrigir "Grupo de X pessoas" no `PricingTicket.tsx`

**Files:**
- Modify: `site/components/PricingTicket.tsx:205-210`

**Problema:** o ticket de preço sempre renderiza `"Grupo de {vagas ?? 30} pessoas. Atendimento direto com Rodrigo. Vagas limitadas."`, mesmo para pacotes `assinadoByRuas` (privativos, sem grupo). O componente já recebe a prop `tipo`, mas ela não é usada.

**Interfaces:**
- Consome: `tipo?: string` (prop já existente em `PricingTicketProps`, valores `"gruposDoRuas" | "assinadoByRuas"`), `vagas?: number`.

- [x] **Step 1: Tornar a frase condicional ao tipo**

Em `site/components/PricingTicket.tsx`, trocar:
```tsx
<p className="text-[16px] flex gap-2" style={{ color: MUTED }}>
  <span style={{ color: MUTED }}>•</span>
  <span>Grupo de {vagas ?? 30} pessoas. Atendimento direto com Rodrigo.{" "}
    <span className="font-semibold" style={{ color: NAVY }}>Vagas limitadas.</span>
  </span>
</p>
```
por:
```tsx
<p className="text-[16px] flex gap-2" style={{ color: MUTED }}>
  <span style={{ color: MUTED }}>•</span>
  {tipo === "gruposDoRuas" ? (
    <span>Grupo de {vagas ?? 30} pessoas. Atendimento direto com Rodrigo.{" "}
      <span className="font-semibold" style={{ color: NAVY }}>Vagas limitadas.</span>
    </span>
  ) : (
    <span>Roteiro privativo, no seu ritmo. Atendimento direto com Rodrigo.{" "}
      <span className="font-semibold" style={{ color: NAVY }}>Disponibilidade sob consulta.</span>
    </span>
  )}
</p>
```

- [x] **Step 2: Verificar**

Run: `grep -n "Grupo de" site/components/PricingTicket.tsx`
Expected: a ocorrência restante deve estar dentro do branch `tipo === "gruposDoRuas"`.

- [x] **Step 3: Commit**

```bash
git add site/components/PricingTicket.tsx
git commit -m "fix(pricing): ticket só fala em grupo para pacotes Grupos do Ruas"
```

---

### Task 5: Confirmar ausência de documentos antigos no Sanity

**Files:**
- Nenhum arquivo de código — verificação de dados via API pública do Sanity.

**Problema:** o item do issue pede para confirmar que não sobrou nenhum documento ou rascunho com tipo antigo (`gruposBrasileiros` ou qualquer outro tipo de grupo removido do schema).

- [x] **Step 1: Consultar o dataset de produção por tipos residuais**

Run:
```bash
curl -s "https://6g3tj20r.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%20match%20%22grupo*%22%5D%7B_id%2C_type%2C_rev%2Cnome%2Ctitulo%7D"
```
Resultado observado nesta sessão: 2 documentos do tipo `grupoWhatsapp` (`"Europa - AGO - 2026"` e `"Japão - JUN - 2026"`), tipo que não existe mais no schema (removido junto com a navbar em commit anterior).

- [x] **Step 2: Decidir com o usuário se os documentos órfãos devem ser apagados**

Esses 2 documentos não aparecem mais no Studio (o tipo não está mais registrado no schema) e não são lidos por nenhuma query do site — são lixo de dataset. Apagar requer um token de API com permissão de escrita (`SANITY_TOKEN`), que não está disponível neste ambiente. **Não apagar sem confirmação explícita do usuário**, pois é uma mutação irreversível em dados de produção.

Se o usuário confirmar, apagar com (requer `SANITY_TOKEN` com permissão de escrita):
```bash
curl -s -X POST "https://6g3tj20r.api.sanity.io/v2024-01-01/data/mutate/production" \
  -H "Authorization: Bearer $SANITY_TOKEN" -H "Content-Type: application/json" \
  -d '{"mutations":[{"delete":{"id":"6c558d2b-7fea-4f17-957e-ff9bbe9962d5"}}},{"delete":{"id":"e5db32f4-7be3-47c1-bea1-1dca4fbaf4c0"}}]}'
```

---

## Self-Review

- **Spec coverage:** issue cobre 5 bullets — `sobre/page.tsx` (Task 1), `page.tsx`/homepage Sanity (já estava limpo, confirmado por grep — nenhuma task necessária), `[slug]/page.tsx:107` (Task 3), Form step 2 (já estava limpo, confirmado por grep — nenhuma task necessária), confirmação Sanity (Task 5). Adicionalmente encontrados e cobertos: `DestinosSection.tsx` (Task 2) e `PricingTicket.tsx` (Task 4), que falavam em "grupo" fora do produto Grupos do Ruas mas não estavam listados explicitamente no issue.
- **Placeholder scan:** nenhum "TBD"/"implementar depois" — todos os steps têm diff completo.
- **Type consistency:** `pacote.tipo` e prop `tipo` usam os mesmos valores (`"gruposDoRuas" | "assinadoByRuas"`) em todas as tasks.
