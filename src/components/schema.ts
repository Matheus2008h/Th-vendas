// Fonte única da verdade: define os campos de cada categoria.
// Usado pelo painel /admin (para montar os formulários) e pela função
// do servidor (para validar o que é salvo). Sem dependências de React.

export type FieldType = "text" | "textarea" | "price" | "number" | "bool" | "lines";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  max?: number;
  required?: boolean;
  placeholder?: string;
}

export interface Collection {
  key: string;
  label: string;
  singular: string;
  emoji: string;
  /** campo usado como título da linha no painel */
  titleKey: string;
  /** grupo no menu do painel */
  group: string;
  fields: Field[];
}

const hl: Field = { key: "highlight", label: "Destaque", type: "bool" };

export const COLLECTIONS: Collection[] = [
  {
    key: "blox", label: "Blox Fruits", singular: "conta", emoji: "🍎", titleKey: "desc", group: "Blox Fruits",
    fields: [
      { key: "icon", label: "Emojis", type: "text", max: 12, placeholder: "🦊💰" },
      { key: "desc", label: "Descrição", type: "text", max: 120, required: true },
      { key: "price", label: "Preço", type: "price", required: true },
      { key: "stock", label: "Estoque", type: "number" },
      hl,
      { key: "discount", label: "Selo de desconto", type: "bool" },
    ],
  },
  {
    key: "freefire", label: "Free Fire", singular: "conta", emoji: "🔥", titleKey: "desc", group: "Free Fire",
    fields: [
      { key: "icon", label: "Emoji", type: "text", max: 12 },
      { key: "desc", label: "Descrição", type: "textarea", max: 220, required: true },
      { key: "price", label: "Preço", type: "price", required: true },
      hl,
    ],
  },
  {
    key: "streaming", label: "Streaming", singular: "serviço", emoji: "🎬", titleKey: "name", group: "Streaming",
    fields: [
      { key: "emoji", label: "Emoji", type: "text", max: 12 },
      { key: "name", label: "Nome", type: "text", max: 60, required: true },
      { key: "price", label: "Preço", type: "price", required: true },
      { key: "note", label: "Observação (opcional)", type: "text", max: 120 },
      hl,
      { key: "adult", label: "Conteúdo +18", type: "bool" },
    ],
  },
  ...(["followers", "likes", "views"] as const).map<Collection>((key) => ({
    key,
    label: key === "followers" ? "Seguidores" : key === "likes" ? "Curtidas" : "Visualizações",
    singular: "opção", emoji: "📱", titleKey: "label", group: "Engajamento",
    fields: [
      { key: "label", label: "Nome", type: "text" as const, max: 70, required: true },
      { key: "price", label: "Preço", type: "price" as const, required: true },
      { key: "unit", label: "Unidade (ex.: /1000)", type: "text" as const, max: 10 },
    ],
  })),
  {
    key: "bots", label: "Bots WhatsApp", singular: "plano", emoji: "🤖", titleKey: "name", group: "Bots WhatsApp",
    fields: [
      { key: "name", label: "Nome do plano", type: "text", max: 40, required: true },
      { key: "price", label: "Preço", type: "price", required: true },
      { key: "tagline", label: "Frase curta", type: "text", max: 80 },
      { key: "badge", label: "Selo (ex.: MAIS POPULAR)", type: "text", max: 24 },
      hl,
      { key: "features", label: "Recursos (um por linha)", type: "lines", max: 80 },
    ],
  },
  {
    key: "sites", label: "Sites Personalizados", singular: "plano", emoji: "🖥️", titleKey: "name", group: "Sites Personalizados",
    fields: [
      { key: "icon", label: "Emoji", type: "text", max: 12 },
      { key: "name", label: "Nome do plano", type: "text", max: 50, required: true },
      { key: "price", label: "Preço", type: "price", required: true },
      { key: "tagline", label: "Frase curta", type: "text", max: 80 },
      { key: "badge", label: "Selo (ex.: MAIS COMPLETO)", type: "text", max: 24 },
      hl,
      { key: "features", label: "Recursos (um por linha)", type: "lines", max: 80 },
    ],
  },
  {
    key: "numbers", label: "Números Virtuais", singular: "opção", emoji: "📱", titleKey: "label", group: "Números Virtuais",
    fields: [
      { key: "icon", label: "Emoji", type: "text", max: 12 },
      { key: "label", label: "Nome", type: "text", max: 50, required: true },
      { key: "desc", label: "Descrição", type: "text", max: 120 },
      { key: "price", label: "Preço", type: "price", required: true },
      hl,
    ],
  },
  {
    key: "traffic", label: "Tráfego para site", singular: "fonte", emoji: "📈", titleKey: "source", group: "Tráfego",
    fields: [
      { key: "emoji", label: "Emoji", type: "text", max: 12 },
      { key: "source", label: "Origem", type: "text", max: 40, required: true },
      { key: "variant", label: "Variação (opcional)", type: "text", max: 30 },
      { key: "price", label: "Preço", type: "price", required: true },
      { key: "unit", label: "Unidade (ex.: /1000)", type: "text", max: 10 },
    ],
  },
];

export const COLLECTION_KEYS = COLLECTIONS.map((c) => c.key);

// ---------- helpers de preço ----------
/** "R$ 1.234,50" | "4,5" | 4.5  ->  número */
export function priceToNumber(v: unknown): number {
  if (typeof v === "number") return v;
  const s = String(v ?? "").replace(/R\$\s*/gi, "").trim();
  if (!s) return NaN;
  // "1.234,50" (pt-BR) ou "4.5" (ponto decimal)
  const n = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  return Number(n);
}

/** número -> "R$ 4,50" */
export function formatBRL(n: number): string {
  const [i, d] = n.toFixed(2).split(".");
  return `R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${d}`;
}

export const clean = (v: unknown, max: number) =>
  // eslint-disable-next-line no-control-regex
  String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

// ---------- validação / normalização (servidor) ----------
export class ValidationError extends Error {}

function sanitizeItem(col: Collection, raw: any, index: number): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const where = `${col.label}, item ${index + 1}`;
  for (const f of col.fields) {
    const v = raw?.[f.key];
    switch (f.type) {
      case "text":
      case "textarea": {
        const s = clean(v, f.max ?? 120);
        if (f.required && !s) throw new ValidationError(`${where}: preencha "${f.label}".`);
        if (s) out[f.key] = s;
        break;
      }
      case "price": {
        const n = priceToNumber(v);
        if (!Number.isFinite(n) || n <= 0 || n > 100000) throw new ValidationError(`${where}: preço inválido.`);
        out[f.key] = formatBRL(Math.round(n * 100) / 100);
        break;
      }
      case "number": {
        const n = Math.floor(Number(v));
        out[f.key] = Number.isFinite(n) && n >= 0 ? Math.min(n, 99999) : 0;
        break;
      }
      case "bool":
        if (v === true) out[f.key] = true;
        break;
      case "lines": {
        const arr = (Array.isArray(v) ? v : String(v ?? "").split("\n"))
          .map((l) => clean(l, f.max ?? 80))
          .filter(Boolean)
          .slice(0, 30);
        out[f.key] = arr;
        break;
      }
    }
  }
  if (raw?.hidden === true) out.hidden = true;
  return out;
}

export function sanitizeCatalog(input: any): Record<string, any> {
  if (!input || typeof input !== "object") throw new ValidationError("Dados inválidos.");

  // contato
  const c = input.contact || {};
  let wa = String(c.whatsapp ?? "").replace(/\D/g, "");
  if (wa.length === 10 || wa.length === 11) wa = "55" + wa;
  if (!/^55\d{10,11}$/.test(wa)) throw new ValidationError("WhatsApp inválido. Use DDD + número (ex.: 11 92052-5996).");
  const d = wa.slice(2);
  const whatsappDisplay =
    d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  const email = clean(c.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new ValidationError("E-mail de contato inválido.");

  // pix
  const p = input.pix || {};
  const key = clean(p.key, 77);
  const merchant = clean(p.merchant, 25);
  if (!key) throw new ValidationError("Informe a chave Pix.");
  if (!merchant) throw new ValidationError("Informe o nome do beneficiário do Pix.");

  const out: Record<string, any> = {
    contact: {
      name: clean(c.name, 40) || "ADM",
      whatsapp: wa,
      whatsappDisplay,
      email,
      instagram: clean(c.instagram, 40).replace(/^@+/, ""),
    },
    pix: {
      key,
      display: clean(p.display, 40) || key,
      merchant,
      city: clean(p.city, 15) || "BRASIL",
    },
    freefireNotice: clean(input.freefireNotice, 400),
  };

  for (const col of COLLECTIONS) {
    const list = input[col.key];
    if (!Array.isArray(list) || list.length > 300) throw new ValidationError(`Lista "${col.label}" inválida.`);
    out[col.key] = list.map((it, i) => sanitizeItem(col, it, i));
  }
  return out;
}
