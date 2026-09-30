/**
 * Adiciona itinerários completos a todos os pacotes existentes.
 * Roda com: node scripts/seed-itinerarios.mjs
 */
import { createClient } from "@sanity/client"

const client = createClient({
  projectId: "6g3tj20r",
  dataset:   "production",
  apiVersion: "2024-01-01",
  token: "skTMByodyxtOZHTjHhNJ0ZoGg81zpCQYsaWoeh2oteGTUMJqImOcSm2Gr2tnA0S06NbzF5PPvjCk7IOpk21lyvnf7SzBlNNuC8cUlgR954RzL6TgqcFaPi9lahIpKdaclOyJwWBYikxglc6pLn4PTBxEJIGLmM2ScD83p8lnA0I5Dj5biLKT",
  useCdn: false,
})

const b = (text) => [{ _type:"block", _key:`b${Math.random().toString(36).slice(2,8)}`, style:"normal", markDefs:[], children:[{ _type:"span", _key:`s1`, text }] }]
const dia = (n, titulo, texto) => ({ _type:"object", _key:`d${n}`, numero:n, titulo, texto: b(texto) })

const itinerarios = {

  "pacote-japao-out2026": [
    dia(1, "Chegada em Tóquio — Shinjuku", "Voo São Paulo → Tóquio. Chegada e check-in em Shinjuku. Tarde pela rua Takeshita e Parque Yoyogi. Jantar em izakaya tradicional em Shibuya com Rodrigo."),
    dia(2, "Tóquio — Asakusa, Akihabara e Ueno", "Manhã cedo no templo Senso-ji antes das multidões. Almoço no Mercado de Ueno. Tarde em Akihabara — a cidade eletrônica. Rodrigo leva aos lugares que guias comuns não mostram."),
    dia(3, "Monte Fuji e Hakone", "Excursão ao Monte Fuji com parada no Lago Kawaguchi. Tarde em Hakone com vista para o vulcão. Onsen tradicional e jantar no ryokan."),
    dia(4, "Shinkansen para Kyoto", "Trem-bala de manhã para Kyoto. Chegada ao meio-dia e primeira imersão no bairro de Gion — o distrito das gueixas. Jantar kaiseki incluído."),
    dia(5, "Fushimi Inari e Arashiyama", "Madrugada no santuário Fushimi Inari — mil torii cor de laranja antes do sol alto. Tarde no bambuzal de Arashiyama e templo Tenryu-ji (UNESCO)."),
    dia(6, "Nara e Osaka — street food", "Visita a Nara com os veados sagrados que caminham livremente. À tarde, Osaka e mergulho na Dotonbori — o melhor street food do Japão. Takoyaki, ramen e kushikatsu."),
  ],

  "pacote-japao-coreia-out2026": [
    dia(1,  "Chegada em Osaka/Kyoto", "Desembarque e check-in em Kyoto. Primeira caminhada pelo bairro de Gion ao entardecer. Jantar em restaurante local com Rodrigo."),
    dia(2,  "Kyoto — Fushimi Inari e Arashiyama", "Fushimi Inari às 6h — os mil torii sem ninguém. Bambuzal de Arashiyama. Tarde livre para explorar os shouji-gashi (doces japoneses) e compras em Kyoto."),
    dia(3,  "Nara e templos budistas", "Excursão a Nara: cervo sagrado e o grande Buda de Todai-ji. Retorno a Kyoto para jantar em restaurante de Kaiseki."),
    dia(4,  "Kyoto → Hakone (trem de 1ª classe)", "Shinkansen para Hakone. Check-in em ryokan tradicional. Banho de onsen com vista para o Monte Fuji. Jantar kaiseki incluído."),
    dia(5,  "Tóquio — Sky Tree e Shibuya", "Trem para Tóquio. Tarde no Sky Tree (vista de 634m), cruzamento de Shibuya e jantar de ramen autêntico."),
    dia(6,  "Tóquio livre — Ginza e Harajuku", "Dia a disposição: compras no Ginza, Harajuku, TeamLab Borderless ou excursão opcional a Nikko."),
    dia(7,  "Voo Tóquio → Seul", "Voo doméstico para Seul. Chegada, check-in e primeiro mergulho na cultura coreana em Myeongdong."),
    dia(8,  "Seul — Palácio e Insadong", "Palácio Gyeongbukgung de manhã. Tarde no bairro de Insadong com arte tradicional e chá coreano. Jantar de galinhada ao ginseng (Samgyetang)."),
    dia(9,  "Seul — DMZ e cultura moderna", "Visita à fronteira com a Coreia do Norte (DMZ). Tarde no bairro de Hongdae — arte de rua e cultura jovem coreana."),
    dia(10, "Gyeongju — capital antiga", "Trem de alta velocidade para Gyeongju, a 'Roma da Ásia'. Tumuli Park e Templo Bulguksa (UNESCO). Jantar de bibimbap local."),
    dia(11, "Busan — mar e polvos", "Trem para Busan. Mercado de frutos do mar de Jagalchi. Templo Haedong Yonggungsa na beira-mar. Jantar de frutos do mar fresco."),
    dia(12, "Seul → São Paulo", "Retorno a Seul e embarque para São Paulo. Fim de uma jornada de dois mundos."),
  ],

  "pacote-ushuaia-ago2026-1": [
    dia(1, "Chegada — Fim do Mundo com Fondue", "Voo GRU (9h10) → USH (15h05). Chegada e transfer ao hotel. À noite: experiência antártica com fondue — o jantar mais austral do mundo."),
    dia(2, "Resort de Neve", "Dia completo no resort: snowshoeing, aulas de ski cross-country, trenó, snowmobile e quadricycle. Rodrigo organiza as atividades em grupo. Jantar incluído."),
    dia(3, "Parque Nacional Tierra del Fuego", "Manhã no parque com trem premium pela Floresta Subantártica. Refeição e bebidas incluídas. Tarde: catamarã pelo Canal Beagle — leões marinhos e pinguins."),
    dia(4, "Ski em Cerro Castor ou Cerro Austral", "Escolha: aulas de ski e snowboard + interação com cães husky + cordeiro patagônico ao fogo OU visitação ao maior ski resort da Patagônia."),
    dia(5, "Expedição 4x4 e Hotel Arakur", "Expedição off-road pelas montanhas nevadas. Jantar no Hotel Arakur — charcuterie, picanha e bebidas à vontade, com vista panorâmica para as montanhas."),
    dia(6, "Retorno a São Paulo", "Transfer ao aeroporto. USH (16h35) → GRU (22h15). O fim do mundo fica para sempre na memória."),
  ],

  "pacote-grecia-assinado": [
    dia(1,  "Atenas — Chegada e Plaka", "Check-in no hotel próximo ao centro histórico. Tarde pela Plaka — o bairro medieval no sopé da Acrópole. Jantar em taberna tradicional com mezze."),
    dia(2,  "Acrópole e Museu Nacional", "Visita guiada à Acrópole às 8h (antes do calor e das multidões). Parthenon, Erecteion e vista de 360°. Tarde no Museu da Acrópole."),
    dia(3,  "Voo para Mykonos", "Voo doméstico para a ilha mais famosa da Grécia. Check-in no hotel e primeira exploração da cidade velha com os famosos moinhos de vento."),
    dia(4,  "Praias de Mykonos", "Dia nas melhores praias da ilha: Paradise, Elia ou Super Paradise. Tarde livre para explorar a cidade velha e fazer compras. Jantar ao pôr do sol."),
    dia(5,  "Ferry para Santorini", "Ferry de Mykonos para Santorini (2h30). Chegada e check-in em hotel com vista para a caldera. Tarde em Oia para o pôr do sol mais fotografado do mundo."),
    dia(6,  "Santorini — Fira e Imerovigli", "Caminhada do caminho cliffside de Fira a Imerovigli. Vista única para o vulcão e o mar. Tarde livre em Akrotiri (sítio arqueológico)."),
    dia(7,  "Passeio ao vulcão e águas termais", "Barco para o vulcão ativo de Santorini. Mergulho nas águas termais naturais. Jantar de frutos do mar em restaurante na beira-mar."),
    dia(8,  "Ferry para Atenas", "Retorno a Atenas de ferry. Tarde livre para compras de última hora em Monastiraki."),
    dia(9,  "Atenas — Cabo Sunion e museus", "Excursão ao Templo de Poseidon em Cabo Sunion ao pôr do sol. Jantar final em restaurante gourmet com vista para a Acrópole iluminada."),
    dia(10, "Retorno", "Transfer ao aeroporto e voo de volta."),
  ],

  "pacote-turquia-assinado": [
    dia(1, "Istambul — Chegada e Bósforo", "Check-in em hotel 5★ em Sultanahmet. Tarde: cruzeiro pelo Bósforo com vista das duas margens (Europa e Ásia). Jantar de mezze turco."),
    dia(2, "Istambul — Hagia Sofia e Grand Bazaar", "Mesquita Azul, Hagia Sofia (patrimônio UNESCO), Cisterna Basílica e Grande Bazar. Rodrigo leva aos vendedores de confiança."),
    dia(3, "Istambul — Palácio Topkapi e Bairro Beyoğlu", "Palácio Topkapi com vista para o Bósforo. Tarde no bairro europeu de Beyoğlu — Istiklal Caddesi, galerias e cafés históricos."),
    dia(4, "Voo para Capadócia", "Voo doméstico para Nevsehir. Check-in em hotel rupestre (cave hotel). Tarde no Valle dos Pombos e Göreme. Pôr do sol único sobre as chaminés de fadas."),
    dia(5, "Capadócia — Cidades subterrâneas e balão", "Manhã de balão ao amanhecer (experiência opcional). Tarde: cidades subterrâneas de Derinkuyu e Valley of Love. Jantar tradicional com música ao vivo."),
    dia(6, "Capadócia → Istambul → Retorno", "Manhã livre na Capadócia. Voo de retorno a Istambul e conexão para São Paulo."),
  ],

  "pacote-croacia-assinado": [
    dia(1, "Dubrovnik — Chegada", "Check-in em hotel 5★ com vista para o mar Adriático. Tarde: primeira caminhada pelas muralhas medievais com vista para a Cidade Velha (UNESCO)."),
    dia(2, "Dubrovnik — Cidade Velha e Montenegro", "Passeio pela Stradun, Fortaleza Lovrijenac e Reitores Palace. Excursão opcional à Baía de Kotor (Montenegro) — uma das mais belas da Europa."),
    dia(3, "Ilha de Hvar — Cruzeiro privativo", "Ferry para Hvar, a ilha mais ensolarada da Europa. Cruzeiro privativo pelas Ilhas Pakleni. Mergulho em águas cristalinas. Jantar de frutos do mar."),
    dia(4, "Split — Palácio de Diocleciano", "Ferry para Split. Check-in e visita ao Palácio de Diocleciano — 1.700 anos de história intacta onde pessoas ainda moram hoje (UNESCO)."),
    dia(5, "Plitvice Lakes — Patrimônio UNESCO", "Excursão de carro para o Parque Nacional de Plitvice. Trilha pelas 16 cascatas e lagos turquesa. Um dos lugares mais bonitos do mundo."),
    dia(6, "Zagreb — Capital", "Viagem para Zagreb. City tour pelo centro histórico: Catedral, Mercado Dolac e bairro boêmio. Jantar de štrukli (prato típico)."),
    dia(7, "Zagreb — Museus e retorno", "Manhã no Museu das Relações Partidas. Transfer ao aeroporto."),
  ],

  "pacote-toscana-assinado": [
    dia(1, "Florença — Chegada", "Check-in em hotel 4★ no centro histórico. Tarde pela Piazza del Duomo, Campanile e Baptistério. Jantar de bistecca alla fiorentina."),
    dia(2, "Florença — Uffizi e Ponte Vecchio", "Manhã na Galleria degli Uffizi (Botticelli, Leonardo, Michelangelo). Tarde: Ponte Vecchio, Oltrarno e Jardins de Boboli. Gelato artesanal obrigatório."),
    dia(3, "Siena e San Gimignano", "Siena medieval com a Piazza del Campo. San Gimignano com suas torres medievais. Degustação de Vernaccia di San Gimignano."),
    dia(4, "Val d'Orcia e Montepulciano", "Passeio pela Val d'Orcia (UNESCO) — ciprestes, colinas e luz perfeita. Montepulciano para degustação de Vino Nobile. Almoço em quinta com vista."),
    dia(5, "Chianti — Degustação de vinhos", "Rota do Chianti Clássico: vinícolas Antinori e Castello di Brolio. Degustação guiada de Chianti Classico DOCG com Rodrigo. Almoço na quinta."),
    dia(6, "Pisa e Lucca", "Torre de Pisa (fotografar com criatividade). Lucca com suas muralhas medievais intactas. Tarde livre para compras em Florença."),
    dia(7, "Roma — Chegada e transferência", "Trem para Roma. City tour rápido pelo Coliseu e Fontana di Trevi. Transfer ao aeroporto."),
  ],
}

async function seedItinerarios() {
  console.log("\n📋 Adicionando itinerários...\n")

  for (const [id, itin] of Object.entries(itinerarios)) {
    const itinerario = itin.map((d, i) => ({ ...d, _key: `dia${i+1}` }))
    try {
      await client.patch(id).set({ itinerario }).commit()
      console.log(`  ✓ ${id} — ${itin.length} dias`)
    } catch (err) {
      console.error(`  ✗ ${id}:`, err.message)
    }
  }

  console.log("\n✅ Itinerários adicionados!\n")
}

seedItinerarios()
