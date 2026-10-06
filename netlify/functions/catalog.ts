// Busca o catálogo salvo pelo painel /admin e aplica sobre os dados padrão de data.ts.
// Se a API não responder (ex.: rodando local com `vite`), o site continua com data.ts.
import * as d from "./data";
import { PIX } from "./pix";

const lists: Record<string, unknown[]> = {
  blox: d.bloxAccounts,
  freefire: d.freefireAccounts,
  streaming: d.streamingItems,
  followers: d.followers,
  likes: d.likes,
  views: d.views,
  traffic: d.trafficItems,
  numbers: d.virtualNumbers,
  sites: d.siteItems,
  bots: d.botPlans,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function applyCatalog(c: any) {
  if (!c || typeof c !== "object") return;

  for (const [key, target] of Object.entries(lists)) {
    if (Array.isArray(c[key])) target.splice(0, target.length, ...c[key]);
  }
  if (c.contact) Object.assign(d.CONTACT, c.contact);
  if (c.pix) {
    PIX.key = c.pix.key || PIX.key;
    PIX.display = c.pix.display || PIX.display;
    PIX.merchant = c.pix.merchant || PIX.merchant;
    PIX.city = c.pix.city || PIX.city;
  }
  if (c.freefireNotice) d.SETTINGS.freefireNotice = c.freefireNotice;
}

/** Devolve true se conseguiu atualizar os dados (para re-renderizar a página). */
export async function loadPublicCatalog(): Promise<boolean> {
  try {
    const res = await fetch("/api/catalog", { headers: { Accept: "application/json" } });
    if (!res.ok || !(res.headers.get("content-type") || "").includes("json")) return false;
    applyCatalog(await res.json());
    return true;
  } catch {
    return false;
  }
}
