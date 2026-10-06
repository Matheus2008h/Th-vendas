// ============================================
// CONTAS BLOX FRUITS - Dados da tabela oficial
// ============================================
export type BloxAccount = {
  icon: string;
  desc: string;
  stock: number;
  price: string;
  highlight?: boolean;
  discount?: boolean;
};

export const bloxAccounts: BloxAccount[] = [
  { icon: "🦊💰", desc: "LV1000 + KITSUNE NO INVENTÁRIO", stock: 2, price: "R$ 20,00", discount: true },
  { icon: "🦊", desc: "LV2800 + GHM + KITSUNE NO INVENTÁRIO", stock: 1, price: "R$ 21,50", highlight: true },
  { icon: "🍎", desc: "CONTA LV2800 + GHM + 1~2 FRUTAS MÍTICAS NO INVENTÁRIO", stock: 3, price: "R$ 4,00" },
  { icon: "🍎", desc: "CONTA LV2800 + GHM + 2~3 FRUTAS MÍTICAS NO INVENTÁRIO", stock: 2, price: "R$ 4,00" },
  { icon: "🍩", desc: "LV2800 + GHM + DOUGH NO INVENTÁRIO", stock: 1, price: "R$ 5,50" },
  { icon: "🍩🔥", desc: "V2 - LV2800 + GHM + DOUGH V2 (INGERIDA)", stock: 1, price: "R$ 5,50" },
  { icon: "⚡", desc: "LV2800 + GHM + RUMBLE NO INVENTÁRIO", stock: 1, price: "R$ 4,00" },
  { icon: "🐯", desc: "LV2800 + GHM + TIGER NO INVENTÁRIO", stock: 2, price: "R$ 5,00" },
  { icon: "🏔️", desc: "LV2800 + GHM + YETI NO INVENTÁRIO", stock: 1, price: "R$ 5,00" },
  { icon: "🌀", desc: "LV2800 + GHM + PORTAL NO INVENTÁRIO", stock: 2, price: "R$ 4,00" },
  { icon: "🧘", desc: "LV2800 + GHM + BUDDHA NO INVENTÁRIO", stock: 2, price: "R$ 4,00" },
  { icon: "☢️", desc: "LV2800 + GHM + GÁS NO INVENTÁRIO", stock: 2, price: "R$ 4,00" },
  { icon: "💀⚔️🎸", desc: "LV2800 + V4 GHOUL (FULL) + GHM + CDK + SGT", stock: 1, price: "R$ 14,50" },
  { icon: "🤖⚔️🎸", desc: "LV2800 + V4 CYBORG (FULL) + GHM + CDK + SGT", stock: 1, price: "R$ 14,50" },
  { icon: "😇⚔️🎸", desc: "LV2800 + V4 ANGEL (FULL) + GHM + CDK + SGT", stock: 2, price: "R$ 13,50" },
  { icon: "🦈⚔️🎸", desc: "LV2800 + GHM + V4 SHARK (FULL) + CDK + SGT", stock: 1, price: "R$ 14,50" },
  { icon: "🧑⚔️🎸", desc: "LV2800 + V4 HUMAN (FULL) + GHM + CDK + SGT", stock: 2, price: "R$ 13,50" },
  { icon: "🎲", desc: "LV2800 + V4 ALEATÓRIA (TIER 1)", stock: 2, price: "R$ 7,00" },
  { icon: "🎲⚔️🎸", desc: "LV2800 + V4 ALEATÓRIA (TIER 1) + GHM + CDK + SG", stock: 2, price: "R$ 10,00" },
  { icon: "🎲⚔️🎸", desc: "LV2800 + V4 ALEATÓRIA (FULL) + GHM + CDK + SG", stock: 2, price: "R$ 10,00" },
  { icon: "👊🗡️", desc: "LV2800 + GOD + TTK", stock: 3, price: "R$ 7,00" },
  { icon: "🩸⚔️🎸", desc: "LV2800 + GHM + SANGUINE + CDK + SGT", stock: 2, price: "R$ 12,00" },
  { icon: "👊⚔️🎸", desc: "LV2800 + GODHUMAN + CDK + SGT", stock: 1, price: "R$ 8,00" },
  { icon: "💀⚔️🎸🍩", desc: "LV2800 + V4 CYBORG (FULL) + GHM + CDK + SGT + DOUGH V2", stock: 1, price: "R$ 17,50", highlight: true },
  { icon: "🦈⚔️🎸🍩", desc: "LV2800 + V4 SHARK (FULL) + GHM + CDK + SGT + DOUGH V2", stock: 1, price: "R$ 16,00", highlight: true },
];

// ============================================
// ENGAJAMENTO INSTAGRAM (com +R$0,50 em tudo)
// ============================================
export type EngagementItem = {
  label: string;
  price: string;
  unit: string;
};

export const followers: EngagementItem[] = [
  { label: "Seguidores mundiais (Básico)", price: "R$ 5,00", unit: "/1000" },
  { label: "Seguidores mundiais (Padrão)", price: "R$ 6,00", unit: "/1000" },
  { label: "Seguidores mundiais (Premium)", price: "R$ 7,50", unit: "/1000" },
  { label: "Seguidores brasileiros", price: "R$ 15,50", unit: "/1000" },
  { label: "Seguidores reais / orgânicos", price: "R$ 60,50", unit: "/1000" },
];

export const likes: EngagementItem[] = [
  { label: "Curtidas mundiais (Básico)", price: "R$ 2,50", unit: "/1k" },
  { label: "Curtidas mundiais (Padrão)", price: "R$ 3,00", unit: "/1k" },
  { label: "Curtidas mundiais (Premium)", price: "R$ 3,50", unit: "/1k" },
  { label: "Curtidas brasileiras SV2", price: "R$ 4,50", unit: "/1k" },
  { label: "Curtidas brasileiras premium", price: "R$ 10,50", unit: "/1k" },
  { label: "Curtidas brasileiras reais / orgânicas", price: "R$ 13,50", unit: "/1k" },
];

export const views: EngagementItem[] = [
  { label: "1.000 Visualizações", price: "R$ 1,30", unit: "" },
  { label: "5.000 Visualizações", price: "R$ 5,80", unit: "" },
  { label: "10.000 Visualizações", price: "R$ 8,00", unit: "" },
  { label: "50.000 Visualizações", price: "R$ 35,00", unit: "" },
];

// ============================================
// TRÁFEGO PARA WEBSITE 🇧🇷
// ============================================
export type TrafficItem = {
  source: string;
  variant?: string;
  price: string;
  unit: string;
  emoji: string;
};

export const trafficItems: TrafficItem[] = [
  { source: "Tumblr", variant: "Padrão", price: "R$ 8,00", unit: "/1000", emoji: "📓" },
  { source: "Google.com.br", variant: "Orgânico", price: "R$ 3,50", unit: "/1000", emoji: "🔍" },
  { source: "Google", price: "R$ 3,52", unit: "/1000", emoji: "🌐" },
  { source: "Quora", price: "R$ 3,50", unit: "/1000", emoji: "❓" },
  { source: "Tumblr", variant: "Premium", price: "R$ 7,50", unit: "/1000", emoji: "📓" },
  { source: "Pinterest", price: "R$ 3,50", unit: "/1000", emoji: "📌" },
  { source: "Twitter", price: "R$ 3,50", unit: "/1000", emoji: "🐦" },
  { source: "Reddit", price: "R$ 3,50", unit: "/1000", emoji: "👽" },
  { source: "YouTube", price: "R$ 3,50", unit: "/1000", emoji: "▶️" },
  { source: "Facebook", price: "R$ 3,50", unit: "/1000", emoji: "📘" },
  { source: "Instagram", price: "R$ 3,50", unit: "/1000", emoji: "📸" },
  { source: "Blogspot.com", price: "R$ 3,50", unit: "/1000", emoji: "📝" },
  { source: "Fiverr", price: "R$ 8,50", unit: "/1000", emoji: "💼" },
];

// ============================================
// STREAMING
// ============================================
export type StreamingItem = {
  name: string;
  price: string;
  emoji: string;
  note?: string;
  adult?: boolean;
  highlight?: boolean;
};

export const streamingItems: StreamingItem[] = [
  { name: "HBO Max", price: "R$ 10,00", emoji: "🎬" },
  { name: "Netflix Privada", price: "R$ 17,00", emoji: "🎥", highlight: true },
  { name: "Disney+ Privada", price: "R$ 14,00", emoji: "🏰" },
  { name: "ChatGPT Go", price: "R$ 30,00", emoji: "🤖", highlight: true },
  { name: "Conta Crunchyroll", price: "R$ 15,00", emoji: "🍥" },
  { name: "Crunchyroll Privado", price: "R$ 10,00", emoji: "🍜" },
  { name: "Spotify Premium", price: "R$ 14,00", emoji: "🎵" },
  { name: "Old Flix", price: "R$ 10,00", emoji: "📼" },
  { name: "Play Plus Hit", price: "R$ 10,00", emoji: "▶️" },
  {
    name: "Google Gemini IA (10 meses)",
    price: "R$ 55,00",
    emoji: "✨",
    note: "Link de ativação no seu e-mail (saiba usar)",
    highlight: true,
  },
  { name: "Premiere + Telecine", price: "R$ 15,00", emoji: "⚽" },
  { name: "Globo + Canais + Premiere", price: "R$ 14,50", emoji: "📺" },
  { name: "Globo + Canais + Telecine", price: "R$ 14,50", emoji: "📡" },
  { name: "Record Plus", price: "R$ 10,00", emoji: "🎞️" },
  { name: "Muby Premium", price: "R$ 14,00", emoji: "🎦" },
  { name: "Cokowa", price: "R$ 6,00", emoji: "🍿" },
  { name: "Pack Planilhas", price: "R$ 10,00", emoji: "📊" },
  { name: "Canva Pro", price: "R$ 6,00", emoji: "🎨" },
  { name: "Apple TV", price: "R$ 13,00", emoji: "🍎" },
  { name: "Tufos", price: "R$ 30,00", emoji: "🔞", adult: true },
];

// ============================================
// FREE FIRE
// ============================================
export type FreeFireAccount = {
  icon: string;
  desc: string;
  price: string;
  highlight?: boolean;
};

export const SETTINGS = {
  freefireNotice:
  "Após a compra, recomendamos fortemente fazer a vinculação da conta (Facebook/Google) assim que possível para garantir a sua segurança e evitar perda de acesso.",
};

export const freefireAccounts: FreeFireAccount[] = [
  {
    icon: "🎫",
    desc: "PASSE FREE FIRE ATUALIZADO - TEMPORADA ATUAL COMPLETA",
    price: "R$ 6,50",
  },
  {
    icon: "🥇",
    desc: "CONTA LEVEL 15 A 23 ALEATÓRIO COM TROCA NICK 🎟️ E TODOS OS PERSONAGENS E PETS E 20K DE OURO",
    price: "R$ 3,00",
  },
  {
    icon: "👤",
    desc: "CONTA GUEST LEVEL 15 A 23 ALEATÓRIO COM TROCA NICK 🎟️",
    price: "R$ 1,50",
  },
  {
    icon: "🌎",
    desc: "CONTA LEVEL 20 COM A PATENTE PLATINA BR RANQUEADO 🇧🇷 VEM COM TROCA NICK 🎟️ E TODOS OS PERSONAGENS E PETS",
    price: "R$ 10,00",
    highlight: true,
  },
  {
    icon: "🪐",
    desc: "CONTA BOT COM TOP CRIMINAL",
    price: "R$ 25,00",
    highlight: true,
  },
];

// ============================================
// NÚMEROS VIRTUAIS
// ============================================
export type VirtualNumber = {
  icon: string;
  label: string;
  desc: string;
  price: string;
  highlight?: boolean;
};

export const virtualNumbers: VirtualNumber[] = [
  {
    icon: "🌍",
    label: "Números Internacionais",
    desc: "Ideal para ativar contas e apps fora do Brasil",
    price: "R$ 4,00",
  },
  {
    icon: "🇧🇷",
    label: "Números Brasileiros",
    desc: "Ideal para ativar contas e apps nacionais",
    price: "R$ 17,50",
    highlight: true,
  },
];

// ============================================
// SITES PERSONALIZADOS
// ============================================
export type SiteItem = {
  name: string;
  price: string;
  tagline: string;
  icon: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export const siteItems: SiteItem[] = [
  {
    name: "Site Personalizado",
    price: "R$ 10,00",
    tagline: "Da sua preferência",
    icon: "🖥️",
    features: [
      "Design 100% personalizado",
      "Escolha de cores e tema",
      "Layout responsivo (celular + PC)",
      "Até 5 seções (páginas)",
      "Formulário de contato",
      "Entrega em até 3 dias",
    ],
  },
  {
    name: "Site Personalizado de Venda",
    price: "R$ 15,00",
    tagline: "Loja online da sua preferência",
    icon: "🛒",
    highlight: true,
    badge: "MAIS COMPLETO",
    features: [
      "Tudo do plano anterior",
      "Catálogo de produtos ilimitado",
      "Botões de compra via WhatsApp",
      "Integração com PIX",
      "Área de depoimentos e FAQ",
      "SEO otimizado para o Google",
      "Suporte pós-entrega",
    ],
  },
];

// ============================================
// BOTS WHATSAPP
// ============================================
export type BotPlan = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export const botPlans: BotPlan[] = [
  {
    name: "Bot Básico",
    price: "R$ 10,00",
    tagline: "Pra quem tá começando",
    features: [
      "Anti-link",
      "Sistema de parceria",
      "Sistema de boas-vindas",
      "Auto ban",
      "Auto fechar/abrir grupo",
    ],
  },
  {
    name: "Bot Médio",
    price: "R$ 17,00",
    tagline: "O mais escolhido pelos clientes",
    highlight: true,
    badge: "MAIS POPULAR",
    features: [
      "Tudo do plano Básico",
      "Menus interativos",
      "Comandos exclusivos pro bot",
      "Vídeo no menu",
    ],
  },
  {
    name: "Bot Completo",
    price: "R$ 27,00",
    tagline: "Solução profissional completa",
    features: [
      "Tudo do plano Médio",
      "Sistema de IA",
      "Sua IA, com seu nome pra chamá-la",
      "Sistema de gerar imagem",
      "Sistema de gerar música",
      "Sistema de criar figurinha",
      "E muito mais!",
    ],
  },
];

// ============================================
// CONTATO
// ============================================
export const CONTACT = {
  whatsapp: "5511920525996",
  whatsappDisplay: "(11) 92052-5996",
  email: "matheushigorleite@gmail.com",
  instagram: "adm_theus",
  name: "ADM Theus",
};

export function whatsLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
