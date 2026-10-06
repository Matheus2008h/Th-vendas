// Função da Netlify: responde tudo em /api/*.
//   GET  /api/catalog          -> catálogo público (sem itens ocultos)
//   POST /api/admin/login      -> { password } => { token }
//   GET  /api/admin/catalog    -> catálogo completo (precisa de token)
//   PUT  /api/admin/catalog    -> salva o catálogo (precisa de token)
// O catálogo editado fica no Netlify Blobs; se ainda não houver nada salvo,
// usa data/catalog.json (os produtos que já estavam no site).
import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import seed from "../../data/catalog.json";
import { sanitizeCatalog, ValidationError, COLLECTION_KEYS } from "../../src/schema.ts";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHash("sha256").update("thvendas:" + ADMIN_PASSWORD).digest("hex");

const store = () => getStore({ name: "thvendas", consistency: "strong" });

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const safeEqual = (a, b) => {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

const sign = (exp) => `${exp}.${crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex")}`;
const verify = (token) => {
  const [exp, sig] = String(token || "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sign(exp), `${exp}.${sig}`);
};

function requireAdmin(request) {
  if (!ADMIN_PASSWORD) return json(503, { error: "Painel desativado: defina a variável ADMIN_PASSWORD na Netlify." });
  const token = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!verify(token)) return json(401, { error: "Sessão inválida ou expirada." });
  return null;
}

// limite simples de tentativas de login (por instância da função)
const attempts = new Map();
function tooManyLogins(ip) {
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  list.push(now);
  attempts.set(ip, list);
  if (attempts.size > 2000) attempts.clear();
  return list.length > 6;
}

async function loadCatalog() {
  try {
    const saved = await store().get("catalog", { type: "json" });
    if (saved) return saved;
  } catch (err) {
    console.error("Falha ao ler o catálogo salvo, usando o padrão.", err);
  }
  return seed;
}

function publicCatalog(c) {
  const out = { contact: c.contact, pix: c.pix, freefireNotice: c.freefireNotice };
  for (const k of COLLECTION_KEYS) out[k] = (c[k] || []).filter((it) => !it.hidden);
  return out;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const method = request.method;

  try {
    if (method === "GET" && path === "/api/catalog") {
      return json(200, publicCatalog(await loadCatalog()));
    }

    if (method === "POST" && path === "/api/admin/login") {
      if (!ADMIN_PASSWORD) return json(503, { error: "Painel desativado: defina a variável ADMIN_PASSWORD na Netlify." });
      const ip = context?.ip || request.headers.get("x-nf-client-connection-ip") || "x";
      if (tooManyLogins(ip)) return json(429, { error: "Muitas tentativas. Tente de novo em 15 minutos." });
      const body = await request.json().catch(() => ({}));
      if (!safeEqual(body.password || "", ADMIN_PASSWORD)) return json(401, { error: "Senha incorreta." });
      return json(200, { token: sign(Date.now() + 8 * 60 * 60 * 1000) });
    }

    if (method === "GET" && path === "/api/admin/catalog") {
      const denied = requireAdmin(request);
      if (denied) return denied;
      return json(200, await loadCatalog());
    }

    if (method === "PUT" && path === "/api/admin/catalog") {
      const denied = requireAdmin(request);
      if (denied) return denied;
      const raw = await request.text();
      if (raw.length > 500000) return json(413, { error: "Dados muito grandes." });
      let next;
      try {
        next = sanitizeCatalog(JSON.parse(raw));
      } catch (err) {
        if (err instanceof ValidationError) return json(422, { error: err.message });
        return json(400, { error: "JSON inválido." });
      }
      await store().setJSON("catalog", next);
      return json(200, next);
    }

    return json(404, { error: "Rota não encontrada." });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Erro interno." });
  }
};

export const config = { path: "/api/*" };
