import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { COLLECTIONS, type Collection, type Field } from "./schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Item = Record<string, any>;
type Catalog = Record<string, any>;

const TOKEN_KEY = "thadmin";

// ---------- chamadas à API ----------
async function api(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw Object.assign(
      new Error("A API não respondeu. O painel só funciona no site publicado na Netlify (ou com `netlify dev`)."),
      { status: 0 }
    );
  }
  if (!res.ok) throw Object.assign(new Error(data?.error || "Erro inesperado."), { status: res.status });
  return data;
}

// ---------- estilos reutilizáveis ----------
const input =
  "w-full rounded-lg border border-red-900/40 bg-black/60 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-red-500";
const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-900/40 bg-black/60 text-slate-300 transition hover:border-red-500 hover:text-white disabled:opacity-30";

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0000] text-white">
      {token ? (
        <Panel token={token} onLogout={logout} />
      ) : (
        <Login
          onLogin={(t) => {
            sessionStorage.setItem(TOKEN_KEY, t);
            setToken(t);
          }}
        />
      )}
    </div>
  );
}

// ---------- login ----------
function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const { token } = await api("/api/admin/login", "", { method: "POST", body: JSON.stringify({ password }) });
      onLogin(token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div className="rounded-2xl border border-red-900/40 bg-black/60 p-6">
        <h1 className="font-display text-3xl tracking-widest text-red-500">TH VENDAS</h1>
        <p className="mb-5 text-sm text-slate-400">Painel administrativo</p>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Senha</label>
        <input
          type="password"
          autoFocus
          className={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && password && submit()}
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          onClick={submit}
          disabled={busy || !password}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-bold uppercase tracking-wider transition hover:bg-red-500 disabled:opacity-40"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}

// ---------- painel ----------
const GROUPS = ["Geral", ...Array.from(new Set(COLLECTIONS.map((c) => c.group)))];

function Panel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [saved, setSaved] = useState("");
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("Geral");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const dirty = catalog !== null && JSON.stringify(catalog) !== saved;

  useEffect(() => {
    api("/api/admin/catalog", token)
      .then((c) => {
        setCatalog(c);
        setSaved(JSON.stringify(c));
      })
      .catch((e) => {
        if (e.status === 401) onLogout();
        else setLoadError(e.message);
      });
  }, [token, onLogout]);

  // avisa se tentar sair com alterações não salvas
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const flash = (text: string, ok = true) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    if (!catalog) return;
    setSaving(true);
    try {
      const next = await api("/api/admin/catalog", token, { method: "PUT", body: JSON.stringify(catalog) });
      setCatalog(next);
      setSaved(JSON.stringify(next));
      flash("Salvo! O site já está atualizado.");
    } catch (e: any) {
      if (e.status === 401) return onLogout();
      flash(e.message, false);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-red-400">{loadError}</p>
        <button onClick={onLogout} className="mt-6 text-sm text-slate-400 underline">
          Sair
        </button>
      </div>
    );
  }
  if (!catalog) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  const setList = (key: string, list: Item[]) => setCatalog({ ...catalog, [key]: list });
  const visible = COLLECTIONS.filter((c) => c.group === tab);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-red-900/40 bg-[#0a0000]/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <div className="font-display text-2xl leading-none tracking-widest text-red-500">TH VENDAS</div>
            <div className="text-[11px] text-slate-500">Painel administrativo</div>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="hidden text-xs text-slate-400 hover:text-white sm:block">
            Ver site
          </a>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider transition ${
              dirty ? "bg-red-600 hover:bg-red-500" : "bg-white/5 text-slate-500"
            }`}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {dirty ? "Salvar" : "Salvo"}
          </button>
          <button onClick={onLogout} className={iconBtn} title="Sair" aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setTab(g)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                tab === g
                  ? "border-red-500 bg-red-600/20 text-white"
                  : "border-red-900/40 text-slate-400 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-6 pb-28">
        {tab === "Geral" && <Settings catalog={catalog} onChange={setCatalog} />}
        {visible.map((col) => (
          <ListEditor
            key={col.key}
            col={col}
            showTitle={visible.length > 1}
            items={catalog[col.key] || []}
            onChange={(list) => setList(col.key, list)}
          />
        ))}
      </main>

      {toast && (
        <div
          className={`fixed inset-x-4 bottom-6 z-40 mx-auto max-w-sm rounded-xl border px-4 py-3 text-center text-sm font-semibold shadow-2xl ${
            toast.ok ? "border-green-600/50 bg-green-950 text-green-200" : "border-red-600/60 bg-red-950 text-red-200"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}

// ---------- configurações gerais ----------
function Settings({ catalog, onChange }: { catalog: Catalog; onChange: (c: Catalog) => void }) {
  const upd = (section: "contact" | "pix", key: string, value: string) =>
    onChange({ ...catalog, [section]: { ...catalog[section], [key]: value } });

  const row = (label: string, section: "contact" | "pix", key: string, hint?: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <input className={input} value={catalog[section]?.[key] ?? ""} onChange={(e) => upd(section, key, e.target.value)} />
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );

  return (
    <>
      <Section title="Contato">
        {row("Nome exibido", "contact", "name")}
        {row("WhatsApp", "contact", "whatsapp", "Com DDD. Ex.: 11 92052-5996. É o número que recebe os pedidos.")}
        {row("E-mail", "contact", "email")}
        {row("Instagram (sem @)", "contact", "instagram")}
      </Section>

      <Section title="Pix">
        {row("Chave Pix", "pix", "key", "Exatamente como cadastrada no banco. Telefone no formato +5511999999999.")}
        {row("Chave para exibir", "pix", "display", "Como aparece para o cliente. Ex.: (11) 92052-5996")}
        {row("Nome do beneficiário", "pix", "merchant", "Até 25 caracteres, igual ao nome da conta.")}
        {row("Cidade", "pix", "city", "Até 15 caracteres, sem acento.")}
      </Section>

      <Section title="Aviso do Free Fire">
        <textarea
          className={`${input} min-h-24`}
          value={catalog.freefireNotice ?? ""}
          onChange={(e) => onChange({ ...catalog, freefireNotice: e.target.value })}
        />
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-red-900/40 bg-black/40 p-4">
      <h2 className="font-display text-xl tracking-widest text-red-400">{title}</h2>
      {children}
    </section>
  );
}

// ---------- editor de lista ----------
function ListEditor({
  col,
  items,
  onChange,
  showTitle,
}: {
  col: Collection;
  items: Item[];
  onChange: (list: Item[]) => void;
  showTitle: boolean;
}) {
  // índices recém-criados começam abertos
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const emptyItem = useMemo<Item>(() => {
    const it: Item = {};
    for (const f of col.fields) it[f.key] = f.type === "bool" ? false : f.type === "lines" ? [] : f.type === "number" ? 0 : "";
    return it;
  }, [col]);

  const patch = (i: number, p: Item) => onChange(items.map((it, n) => (n === i ? { ...it, ...p } : it)));
  const remove = (i: number) => {
    if (!window.confirm("Apagar este item?")) return;
    setOpened(new Set());
    onChange(items.filter((_, n) => n !== i));
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setOpened(new Set());
    onChange(next);
  };
  const duplicate = (i: number) => {
    const next = [...items];
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(items[i])));
    setOpened(new Set([i + 1]));
    onChange(next);
  };
  const add = () => {
    setOpened(new Set([items.length]));
    onChange([...items, { ...emptyItem }]);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl tracking-widest text-red-400">
          {showTitle ? `${col.label} ` : `${col.emoji} ${col.label} `}
          <span className="text-sm text-slate-500">({items.length})</span>
        </h2>
        <button
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-500"
        >
          <Plus className="h-4 w-4" /> Adicionar {col.singular}
        </button>
      </div>

      {items.length === 0 && <p className="rounded-xl border border-dashed border-red-900/40 p-6 text-center text-sm text-slate-500">Nenhum item. Esta categoria fica vazia no site.</p>}

      {items.map((it, i) => (
        <ItemCard
          key={`${i}-${opened.has(i) ? "o" : "c"}`}
          col={col}
          item={it}
          index={i}
          total={items.length}
          startOpen={opened.has(i)}
          onPatch={(p) => patch(i, p)}
          onMove={(d) => move(i, d)}
          onDuplicate={() => duplicate(i)}
          onDelete={() => remove(i)}
        />
      ))}
    </section>
  );
}

function ItemCard({
  col,
  item,
  index,
  total,
  startOpen,
  onPatch,
  onMove,
  onDuplicate,
  onDelete,
}: {
  col: Collection;
  item: Item;
  index: number;
  total: number;
  startOpen: boolean;
  onPatch: (p: Item) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(startOpen);
  const hidden = item.hidden === true;
  const emoji = item.icon || item.emoji || "";
  const title = [item[col.titleKey], item.variant].filter(Boolean).join(" · ") || `Novo item`;
  const priceField = col.fields.find((f) => f.type === "price");

  return (
    <div className={`rounded-xl border bg-black/50 ${hidden ? "border-slate-700 opacity-60" : "border-red-900/40"}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-3 py-3 text-left">
        <span className="w-8 shrink-0 text-center text-xl">{emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{title}</span>
          <span className="block text-xs text-slate-500">
            {priceField && (item[priceField.key] || "sem preço")}
            {hidden && " · oculto no site"}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-red-900/30 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {col.fields
              .filter((f) => f.type !== "bool")
              .map((f) => (
                <FieldInput key={f.key} field={f} value={item[f.key]} onChange={(v) => onPatch({ [f.key]: v })} />
              ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {col.fields
              .filter((f) => f.type === "bool")
              .map((f) => (
                <Check key={f.key} label={f.label} checked={item[f.key] === true} onChange={(v) => onPatch({ [f.key]: v })} />
              ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-red-900/30 pt-3">
            <button onClick={() => onPatch({ hidden: !hidden })} className={`${iconBtn} w-auto gap-2 px-3 text-xs font-bold`}>
              {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {hidden ? "Mostrar no site" : "Ocultar do site"}
            </button>
            <div className="ml-auto flex gap-2">
              <button onClick={() => onMove(-1)} disabled={index === 0} className={iconBtn} aria-label="Subir">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => onMove(1)} disabled={index === total - 1} className={iconBtn} aria-label="Descer">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button onClick={onDuplicate} className={iconBtn} aria-label="Duplicar">
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={onDelete} className={`${iconBtn} hover:!border-red-500 hover:!text-red-400`} aria-label="Apagar">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const wide = field.type === "textarea" || field.type === "lines";
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea className={`${input} min-h-20`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === "lines" ? (
        <textarea
          className={`${input} min-h-28`}
          value={Array.isArray(value) ? value.join("\n") : value ?? ""}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      ) : field.type === "number" ? (
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className={input}
          value={value ?? 0}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      ) : (
        <input
          className={input}
          inputMode={field.type === "price" ? "decimal" : undefined}
          placeholder={field.type === "price" ? "Ex.: 4,50" : field.placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
      <input type="checkbox" className="h-4 w-4 accent-red-600" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
