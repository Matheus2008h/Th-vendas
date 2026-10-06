// ============================================================
// Gerador de PIX Copia e Cola (BR Code / EMV)
// Compatível com qualquer app de banco brasileiro
// ============================================================

import { CONTACT } from "./data";

// Mutável: o painel /admin pode trocar esses valores (ver catalog.ts)
export const PIX = {
  key: "+5511920525996",
  display: "(11) 92052-5996",
  merchant: "MATHEUS HIGOR",
  city: "SAO PAULO",
};

// Calcula o CRC16-CCITT (polinômio 0x1021) usado no fim do BR Code
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Formata um campo do EMV: ID (2) + Length (2) + Value
function field(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

// Remove acentos e caracteres especiais (PIX só aceita ASCII simples)
function sanitize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toUpperCase()
    .slice(0, 25);
}

export interface PixOptions {
  key?: string;
  merchant?: string;
  city?: string;
  amount: number;
  txId?: string;
  description?: string;
}

/**
 * Gera o payload PIX (BR Code copia-e-cola)
 */
export function generatePixPayload({
  key = PIX.key,
  merchant = PIX.merchant,
  city = PIX.city,
  amount,
  txId = "TH" + Date.now().toString().slice(-10),
}: PixOptions): string {
  const merchantName = sanitize(merchant);
  const cityName = sanitize(city);
  const cleanTxId = txId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25);

  // Merchant Account Information (ID 26) - PIX
  const gui = field("00", "br.gov.bcb.pix");
  const pixKey = field("01", key);
  const mai = field("26", gui + pixKey);

  const payloadFormat = field("00", "01");
  const merchantCategory = field("52", "0000");
  const currency = field("53", "986"); // BRL
  const amountStr = field("54", amount.toFixed(2));
  const country = field("58", "BR");
  const merchantNameF = field("59", merchantName);
  const cityF = field("60", cityName);
  const additional = field("62", field("05", cleanTxId));

  const partial =
    payloadFormat +
    mai +
    merchantCategory +
    currency +
    amountStr +
    country +
    merchantNameF +
    cityF +
    additional +
    "6304"; // CRC placeholder

  const crc = crc16(partial);
  return partial + crc;
}

// Parse "R$ 10,00" or "R$ 14,50" → 10.00
export function parsePrice(priceStr: string): number {
  const clean = priceStr
    .replace(/R\$\s*/gi, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  return parseFloat(clean) || 0;
}

// Retorna o link do WhatsApp com mensagem já formatada de comprovante
export function buildReceiptWhatsLink(
  productName: string,
  price: string,
  txId: string,
  items?: { name: string; price: string; qty: number }[]
) {
  const productsBlock =
    items && items.length > 0
      ? items.map((it) => `• ${it.qty}x ${it.name} — ${it.price}`).join("\n")
      : `*Produto:* ${productName}`;

  const msg =
    `🛒 *NOVA COMPRA - TH VENDAS*\n\n` +
    `${productsBlock}\n\n` +
    `*Valor Total:* ${price}\n` +
    `*ID Transação:* ${txId}\n\n` +
    `✅ *Pagamento realizado via PIX!*\n\n` +
    `Segue em anexo o comprovante do pagamento. Aguardo a liberação do produto, obrigado! 🙌`;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}
