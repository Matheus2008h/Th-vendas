import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Flame,
  Shield,
  Lock,
  Zap,
  Handshake,
  Check,
  Mail,
  Star,
  Camera,
  Bot,
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  Plus,
  Clock,
  Award,
  Rocket,
  Menu,
  X,
  Film,
  Globe,
  QrCode,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Ban,
  HeartHandshake,
  ChevronRight,
  Gamepad2,
  Smartphone,
  ShoppingCart,
  Eye,
  TrendingUp,
} from "lucide-react";
import {
  bloxAccounts,
  followers,
  likes,
  views,
  botPlans,
  streamingItems,
  siteItems,
  freefireAccounts,
  SETTINGS,
  virtualNumbers,
  trafficItems,
  CONTACT,
  whatsLink,
} from "./data";
import { loadPublicCatalog } from "./catalog";
import Particles from "./components/Particles";
import { PaymentProvider, usePayment } from "./components/PaymentContext";
import { CartProvider, useCart, type CartProductInput } from "./components/CartContext";
import CartDrawer, { FloatingCartButton } from "./components/CartDrawer";

// WhatsApp SVG (Lucide doesn't have a proper one)
const WhatsIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Section = "blox" | "freefire" | "engagement" | "bots" | "streaming" | "sites" | "numbers" | "traffic";

// === Animation variants ===
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// === Categories meta ===
const categories: {
  id: Section;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  desc: string;
  count: string;
  gradient: string;
  glow: string;
}[] = [
  {
    id: "blox",
    label: "Blox Fruits",
    emoji: "🍎",
    icon: <Flame className="h-8 w-8" />,
    desc: "Contas com Godhuman, V4, frutas raras e mais",
    get count() {
      return `${bloxAccounts.length} contas`;
    },
    gradient: "from-red-600 to-red-900",
    glow: "shadow-red-600/40",
  },
  {
    id: "freefire",
    label: "Free Fire",
    emoji: "🔥",
    icon: <Gamepad2 className="h-8 w-8" />,
    desc: "Contas guest e ranqueadas com skins, personagens e pets",
    get count() {
      return `${freefireAccounts.length} contas`;
    },
    gradient: "from-orange-600 to-red-900",
    glow: "shadow-orange-600/40",
  },
  {
    id: "streaming",
    label: "Streaming",
    emoji: "🎬",
    icon: <Film className="h-8 w-8" />,
    desc: "Netflix, Disney+, HBO, Spotify, Gemini e muito mais",
    get count() {
      return `${streamingItems.length} serviços`;
    },
    gradient: "from-purple-600 to-red-900",
    glow: "shadow-purple-600/40",
  },
  {
    id: "engagement",
    label: "Engajamento",
    emoji: "📱",
    icon: <Camera className="h-8 w-8" />,
    desc: "Seguidores e curtidas para Instagram",
    get count() {
      return `${followers.length + likes.length + views.length} opções`;
    },
    gradient: "from-pink-600 to-red-900",
    glow: "shadow-pink-600/40",
  },
  {
    id: "bots",
    label: "Bots WhatsApp",
    emoji: "🤖",
    icon: <Bot className="h-8 w-8" />,
    desc: "Automatize atendimento, vendas e grupos",
    get count() {
      return `${botPlans.length} planos`;
    },
    gradient: "from-green-600 to-red-900",
    glow: "shadow-green-600/40",
  },
  {
    id: "sites",
    label: "Sites Personalizados",
    emoji: "🖥️",
    icon: <Globe className="h-8 w-8" />,
    desc: "Sites profissionais e lojas online do seu jeito",
    get count() {
      return `${siteItems.length} planos`;
    },
    gradient: "from-blue-600 to-red-900",
    glow: "shadow-blue-600/40",
  },
  {
    id: "numbers",
    label: "Números Virtuais",
    emoji: "📱",
    icon: <Smartphone className="h-8 w-8" />,
    desc: "Números internacionais e brasileiros para ativação de contas",
    get count() {
      return `${virtualNumbers.length} opções`;
    },
    gradient: "from-teal-600 to-red-900",
    glow: "shadow-teal-600/40",
  },
  {
    id: "traffic",
    label: "Tráfego-website 🇧🇷",
    emoji: "📈",
    icon: <TrendingUp className="h-8 w-8" />,
    desc: "Tráfego para seu site vindo de Google, Facebook, Instagram e mais",
    get count() {
      return `${trafficItems.length} opções`;
    },
    gradient: "from-cyan-600 to-red-900",
    glow: "shadow-cyan-600/40",
  },
];

export default function App() {
  // Busca o catálogo salvo pelo painel /admin; enquanto não chega (ou se falhar),
  // o site mostra os produtos que estão em data.ts.
  const [version, setVersion] = useState(0);
  useEffect(() => {
    loadPublicCatalog().then((changed) => changed && setVersion((v) => v + 1));
  }, []);

  return (
    <PaymentProvider>
      <CartProvider>
        <AppContent version={version} />
      </CartProvider>
    </PaymentProvider>
  );
}

// `version` só existe para re-renderizar tudo quando o catálogo chega
function AppContent({ version }: { version: number }) {
  void version;
  const [section, setSection] = useState<Section | null>(null);

  // Scroll to product area when a category is selected
  useEffect(() => {
    if (section) {
      const el = document.getElementById("product-area");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section]);

  return (
    <div className="grunge-bg relative min-h-screen text-white">
      <Particles count={20} />
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />

      <Navbar onCategoryClick={setSection} />
      <Hero onScrollToCategories={() => {
        document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" });
      }} />
      <Marquee />

      {/* IMPORTANT NOTICE */}
      <ImportantNotice />

      {/* CATEGORIES GRID */}
      <CategoriesGrid section={section} setSection={setSection} />

      {/* PRODUCT AREA (only when a section is selected) */}
      <div id="product-area">
        <AnimatePresence mode="wait">
          {section && (
            <motion.main
              key={section}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 mx-auto max-w-7xl px-4 pb-16"
            >
              {/* Back button */}
              <button
                onClick={() => setSection(null)}
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-red-900/40 bg-black/60 px-4 py-2 text-sm font-bold uppercase tracking-wider text-red-400 backdrop-blur transition hover:border-red-500 hover:bg-red-950/60 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar às categorias
              </button>

              {section === "blox" && <BloxFruitsSection />}
              {section === "freefire" && <FreeFireSection />}
              {section === "streaming" && <StreamingSection />}
              {section === "engagement" && <EngagementSection />}
              {section === "bots" && <BotsSection />}
              {section === "sites" && <SitesSection />}
              {section === "numbers" && <VirtualNumbersSection />}
              {section === "traffic" && <TrafficSection />}
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      <TrustBar />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}

/* =========================================================================
   NAVBAR
   ========================================================================= */
function Navbar({ onCategoryClick }: { onCategoryClick: (s: Section) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-red-900/40 bg-black/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900 font-black text-white shadow-lg shadow-red-600/50"
          >
            TH
          </motion.div>
          <div>
            <div className="font-brush text-xl leading-none text-white blood-glow">
              TH Vendas
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-500">
              ADM THEUS
            </div>
          </div>
        </a>

        <div className="hidden gap-2 md:flex">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryClick(c.id)}
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:bg-red-950/40 hover:text-red-400 group"
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
          <a href="#faq" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:text-red-400">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-2">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={whatsLink("Olá ADM Theus, vim pelo site!")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-green-500/40"
          >
            <WhatsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Chamar</span>
          </motion.a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg border border-red-900/40 bg-red-950/40 p-2 text-red-400"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-red-900/40 bg-black/95 md:hidden"
          >
            <div className="flex flex-col p-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setOpen(false);
                    onCategoryClick(c.id);
                  }}
                  className="flex items-center gap-2 border-b border-red-900/20 py-3 text-left text-sm font-semibold text-slate-300 hover:text-red-500"
                >
                  <span>{c.emoji}</span>
                  {c.label}
                </button>
              ))}
              <a
                href="#faq"
                onClick={() => setOpen(false)}
                className="border-b border-red-900/20 py-3 text-sm font-semibold text-slate-300 hover:text-red-500"
              >
                📘 FAQ
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */
function Hero({ onScrollToCategories }: { onScrollToCategories: () => void }) {
  return (
    <section id="top" className="relative z-10 overflow-hidden px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative mx-auto max-w-6xl text-center"
      >
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 text-xs font-bold text-red-400 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          LOJA 100% CONFIÁVEL • +5.000 CLIENTES ATENDIDOS
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-brush text-4xl leading-tight text-white blood-glow sm:text-6xl md:text-7xl"
        >
          TH VENDAS,
        </motion.h1>
        <motion.h2
          variants={fadeUp}
          className="mt-2 font-brush text-3xl leading-tight blood-glow sm:text-5xl md:text-6xl"
        >
          <span className="gradient-text">qualidade e confiança,</span>
        </motion.h2>
        <motion.h3
          variants={fadeUp}
          className="mt-2 font-brush text-5xl leading-none text-red-600 blood-glow sm:text-7xl md:text-8xl"
        >
          só aqui!
        </motion.h3>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl font-display text-lg tracking-widest text-slate-300 sm:text-xl"
        >
          OS MELHORES ITENS, PELO MELHOR PREÇO!
        </motion.p>

        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-base text-slate-400">
          Contas de <span className="font-bold text-red-400">Blox Fruits</span>, serviços de{" "}
          <span className="font-bold text-red-400">streaming</span>, impulsionamento em{" "}
          <span className="font-bold text-red-400">redes sociais</span> e{" "}
          <span className="font-bold text-red-400">bots de WhatsApp</span> profissionais.
          Fale direto com o <span className="font-brush text-red-500">ADM Theus</span>.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScrollToCategories}
            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-800 px-8 py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/40 animate-pulse-red"
          >
            <Flame className="h-5 w-5 transition group-hover:rotate-12" />
            Ver Categorias
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={whatsLink("Olá ADM Theus, quero comprar!")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-950/40 px-8 py-3 font-bold uppercase tracking-wider text-green-400 transition hover:bg-green-500 hover:text-white"
          >
            <WhatsIcon className="h-5 w-5" />
            Chamar no Zap
          </motion.a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: <Users size={20} />, n: "5K+", l: "Clientes" },
            { icon: <Shield size={20} />, n: "100%", l: "Confiável" },
            { icon: <Clock size={20} />, n: "48h", l: "Garantia" },
            { icon: <Star size={20} />, n: "4.9", l: "Avaliação" },
          ].map((s) => (
            <motion.div
              key={s.l}
              whileHover={{ y: -5, borderColor: "rgba(239, 68, 68, 0.6)" }}
              className="rounded-lg border border-red-900/40 bg-black/60 p-4 backdrop-blur"
            >
              <div className="flex items-center justify-center gap-1 text-red-500">
                {s.icon}
                <span className="font-brush text-2xl blood-glow">{s.n}</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   MARQUEE
   ========================================================================= */
function Marquee() {
  const items = [
    "🔥 ENTREGA IMEDIATA",
    "⚡ PIX APROVADO EM SEGUNDOS",
    "🛡️ GARANTIA DE 48H",
    "💎 MELHORES PREÇOS",
    "🎯 ADM THEUS ONLINE",
    "🚀 +5.000 CLIENTES SATISFEITOS",
    "🏆 LOJA #1 DE STREAMING E GAMES",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="relative z-10 overflow-hidden border-y border-red-900/40 bg-gradient-to-r from-red-950/60 via-black to-red-950/60 py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((t, i) => (
          <span key={i} className="mx-6 text-sm font-bold uppercase tracking-widest text-red-400">
            {t} <span className="mx-6 text-red-800">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   IMPORTANT NOTICE - Aviso pros clientes
   ========================================================================= */
function ImportantNotice() {
  const [expanded, setExpanded] = useState(false);
  const rules = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Garantia de até 48h",
      desc: "Todos os produtos possuem garantia de 48 horas após a entrega. Qualquer problema, chame o suporte.",
      color: "text-green-400",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Atendimento do Suporte",
      desc: "Caso precise de suporte, utilize a opção suporte no bot. Nosso atendimento é de segunda a sexta, das 12:00 às 20:00.",
      color: "text-blue-400",
    },
    {
      icon: <Ban className="h-5 w-5" />,
      title: "Política de Reembolsos",
      desc: "Não realizamos reembolsos via Pix. Não reembolsamos compras erradas, então escolha com cuidado antes de finalizar.",
      color: "text-red-400",
    },
    {
      icon: <HeartHandshake className="h-5 w-5" />,
      title: "Agradecemos sua compreensão",
      desc: "Desejamos uma excelente experiência! Boas compras! 🛍️🚀",
      color: "text-pink-400",
    },
  ];

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-950/40 via-red-950/40 to-black/80 p-6 shadow-2xl shadow-yellow-500/10 backdrop-blur animate-glow-border"
      >
        {/* Warning stripe */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #eab308 0 10px, #000 10px 20px)",
          }}
        />

        {/* Header */}
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-black shadow-lg shadow-yellow-500/40"
          >
            <AlertTriangle className="h-8 w-8" strokeWidth={2.5} />
          </motion.div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <h2 className="font-brush text-2xl text-yellow-400 blood-glow sm:text-3xl">
                Aviso Importante
              </h2>
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="mt-1 text-sm font-bold text-red-400">
              ⚠️ ANTES DE COMPRAR, LEIA NOSSAS REGRAS COM ATENÇÃO 👇🏻
            </p>
          </div>
        </div>

        {/* Toggle rules */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-yellow-500/30 bg-black/40 px-4 py-3 text-left transition hover:border-yellow-500/60 hover:bg-black/60"
        >
          <span className="flex items-center gap-2 font-bold text-white">
            📋 REGRAS DA LOJA
            <span className="text-xs font-normal text-slate-400">
              (clique pra {expanded ? "recolher" : "ler"})
            </span>
          </span>
          <motion.span animate={{ rotate: expanded ? 90 : 0 }}>
            <ChevronRight className="h-5 w-5 text-yellow-400" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {rules.map((r, i) => (
                  <motion.div
                    key={r.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 rounded-lg border border-red-900/30 bg-black/50 p-4 transition hover:border-yellow-500/40"
                  >
                    <div className={`flex-shrink-0 ${r.color}`}>{r.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{r.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{r.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   CATEGORIES GRID (main navigation)
   ========================================================================= */
function CategoriesGrid({
  section,
  setSection,
}: {
  section: Section | null;
  setSection: (s: Section) => void;
}) {
  return (
    <section id="categorias" className="relative z-10 mx-auto max-w-7xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <div className="mb-3 inline-block rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-red-400">
          🛒 Escolha sua categoria
        </div>
        <h2 className="font-brush text-4xl text-white blood-glow sm:text-5xl">
          Nossas Categorias
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          Clique em uma categoria abaixo para ver todos os produtos disponíveis
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {categories.map((c) => {
          const isActive = section === c.id;
          return (
            <motion.button
              key={c.id}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSection(c.id)}
              className={`shine-card group relative flex flex-col items-start overflow-hidden rounded-2xl border p-6 text-left transition-all ${
                isActive
                  ? "border-red-500 bg-gradient-to-br from-red-950/80 to-black shadow-2xl shadow-red-600/40"
                  : "border-red-900/40 bg-black/70 hover:border-red-500/60 backdrop-blur"
              }`}
            >
              {/* Gradient orb */}
              <div
                className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`}
              />

              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg ${c.glow}`}
              >
                {c.icon}
              </div>

              <div className="relative mt-4 flex items-center gap-2">
                <span className="text-2xl">{c.emoji}</span>
                <h3 className="font-brush text-2xl text-white blood-glow">
                  {c.label}
                </h3>
              </div>

              <p className="relative mt-2 text-sm text-slate-400">{c.desc}</p>

              <div className="relative mt-4 flex w-full items-center justify-between">
                <span className="rounded-full border border-red-900/40 bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-400">
                  {c.count}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-500 opacity-0 transition group-hover:opacity-100">
                  Ver
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-cat"
                  className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-red-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {!section && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs uppercase tracking-widest text-slate-500"
        >
          👆 Selecione uma categoria acima para ver os produtos
        </motion.p>
      )}
    </section>
  );
}

/* =========================================================================
   STREAMING SECTION
   ========================================================================= */
function StreamingSection() {
  const { openPayment } = usePayment();
  return (
    <section id="streaming">
      <SectionHeader
        badge="🎬 Streaming e Assinaturas"
        title="Streaming e Assinaturas"
        subtitle={
          <>
            As melhores plataformas com preços imbatíveis!{" "}
            <strong className="text-red-400">Todos os produtos com garantia de 48h.</strong>{" "}
            Leia as regras acima antes de comprar.
          </>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {streamingItems.map((s) => (
          <motion.div
            key={s.name}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className={`shine-card relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all ${
              s.highlight
                ? "border-yellow-500/50 bg-gradient-to-b from-red-950/70 to-black/90 shadow-lg shadow-yellow-500/10"
                : s.adult
                ? "border-pink-900/60 bg-gradient-to-b from-pink-950/40 to-black/90"
                : "border-red-900/40 bg-black/70 hover:border-red-500/50 backdrop-blur"
            }`}
          >
            {/* Badges */}
            <div className="mb-2 flex flex-wrap gap-1">
              {s.highlight && (
                <span className="inline-flex items-center gap-1 rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase text-black">
                  <Sparkles size={9} /> DESTAQUE
                </span>
              )}
              {s.adult && (
                <span className="inline-flex items-center gap-1 rounded bg-pink-600 px-2 py-0.5 text-[9px] font-black uppercase text-white">
                  🔞 +18
                </span>
              )}
            </div>

            <div className="mb-3 flex items-center gap-3">
              <span className="text-4xl">{s.emoji}</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white leading-tight">
                  {s.name}
                </h3>
                {s.note && (
                  <p className="mt-1 text-[10px] italic text-slate-400 leading-tight">
                    {s.note}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto flex items-baseline gap-1">
              <span className="font-brush text-2xl text-red-500 blood-glow">
                {s.price}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openPayment({ name: s.name, price: s.price, category: "Streaming" })
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition"
              >
                <QrCode className="h-3 w-3" /> Comprar com PIX
              </motion.button>
              <AddToCartButton
                product={{
                  id: `streaming-${s.name}`,
                  name: s.name,
                  price: s.price,
                  category: "Streaming",
                  emoji: s.emoji,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <CTABox
        title={
          <>
            Não achou o serviço que <span className="text-red-500">procura?</span>
          </>
        }
        subtitle="Temos MUITO mais streaming disponível! Chama no zap que a gente resolve pra você."
        message="Olá ADM Theus, quero saber sobre outros serviços de streaming!"
        buttonText="Chamar no WhatsApp"
      />
    </section>
  );
}

/* =========================================================================
   BLOX FRUITS
   ========================================================================= */
function BloxFruitsSection() {
  const { openPayment } = usePayment();
  return (
    <section id="blox">
      <SectionHeader
        badge="🍎 Catálogo Blox Fruits"
        title="Tabela de Contas Blox Fruits"
        subtitle={
          <>
            Todas as contas com <strong className="text-red-400">e-mail e senha originais</strong>,
            entrega imediata e suporte até a entrega. Estoque atualizado em tempo real.
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-6 flex flex-wrap justify-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-widest text-slate-400"
      >
        {[
          ["GHM", "Godhuman"],
          ["CDK", "Cursed Dual Katana"],
          ["SGT", "Soul Guitar"],
          ["TTK", "True Triple Katana"],
          ["V4", "Race V4"],
        ].map(([abbr, meaning], i, arr) => (
          <span key={abbr} className="flex items-center gap-1">
            <span className="text-red-500 font-bold">{abbr}</span> = {meaning}
            {i < arr.length - 1 && <span className="ml-3 text-red-800">•</span>}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="noise relative overflow-hidden rounded-xl border border-red-900/40 bg-black/70 backdrop-blur"
      >
        <div className="hidden grid-cols-12 gap-2 border-b border-red-900/60 bg-gradient-to-r from-red-950/80 to-black/80 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-400 md:grid">
          <div className="col-span-1">Ícone</div>
          <div className="col-span-7">Descrição da Conta</div>
          <div className="col-span-2 text-center">Estoque</div>
          <div className="col-span-2 text-right">Preço</div>
        </div>

        {bloxAccounts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.3) }}
            className={`blox-row grid grid-cols-12 items-center gap-2 border-b border-red-900/20 px-4 py-3 last:border-b-0 ${
              a.highlight ? "bg-red-950/30" : ""
            }`}
          >
            <div className="col-span-2 flex items-center gap-1 text-xl md:col-span-1">{a.icon}</div>
            <div className="col-span-10 md:col-span-7">
              <div className="text-sm font-semibold text-white">{a.desc}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {a.discount && (
                  <span className="inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                    <Flame size={9} /> DESCONTO
                  </span>
                )}
                {a.highlight && (
                  <span className="inline-flex items-center gap-1 rounded bg-yellow-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-black">
                    <Sparkles size={9} /> EXCLUSIVA
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 md:hidden">
                <span className="text-[10px] text-slate-500">({a.stock} em estoque)</span>
                <span className="ml-auto font-brush text-lg text-red-500 blood-glow">
                  {a.price}
                </span>
              </div>
            </div>
            <div className="hidden text-center md:col-span-2 md:block">
              <span className="rounded-full border border-red-900/40 bg-black/60 px-2 py-1 text-[11px] text-red-400">
                {a.stock} em estoque
              </span>
            </div>
            <div className="hidden text-right md:col-span-2 md:flex md:flex-col md:items-end md:gap-1">
              <span className="font-brush text-xl text-red-500 blood-glow">{a.price}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    openPayment({ name: a.desc, price: a.price, category: "Blox Fruits" })
                  }
                  className="flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-red-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-red-600/30 transition hover:scale-105"
                >
                  <QrCode size={10} /> Comprar
                </button>
                <AddToCartButton
                  size="sm"
                  product={{
                    id: `blox-${a.desc}`,
                    name: a.desc,
                    price: a.price,
                    category: "Blox Fruits",
                    emoji: a.icon,
                  }}
                />
              </div>
            </div>
            <div className="col-span-12 mt-2 flex items-center gap-2 md:hidden">
              <button
                onClick={() =>
                  openPayment({ name: a.desc, price: a.price, category: "Blox Fruits" })
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30"
              >
                <QrCode className="h-3 w-3" /> Comprar com PIX
              </button>
              <AddToCartButton
                product={{
                  id: `blox-${a.desc}`,
                  name: a.desc,
                  price: a.price,
                  category: "Blox Fruits",
                  emoji: a.icon,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <CTABox
        title={
          <>
            No melhor Theus, pra vir com <span className="text-red-500">ADM THEUS!</span>
          </>
        }
        subtitle="Não achou o que procura? Fale com a gente, temos muito mais em estoque!"
        message="Olá ADM Theus, quero comprar uma conta de Blox Fruits!"
      />
    </section>
  );
}

/* =========================================================================
   FREE FIRE
   ========================================================================= */
function FreeFireSection() {
  const { openPayment } = usePayment();
  return (
    <section id="freefire">
      <SectionHeader
        badge="🔥 Catálogo Free Fire"
        title="Contas Free Fire"
        subtitle={
          <>
            Contas com <strong className="text-red-400">e-mail e senha originais</strong>,
            entrega imediata e suporte até a entrega. Escolha a sua abaixo.
          </>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {freefireAccounts.map((a, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className={`shine-card relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all ${
              a.highlight
                ? "border-yellow-500/50 bg-gradient-to-b from-red-950/70 to-black/90 shadow-lg shadow-yellow-500/10"
                : "border-red-900/40 bg-black/70 hover:border-red-500/50 backdrop-blur"
            }`}
          >
            {a.highlight && (
              <div className="mb-2 flex flex-wrap gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase text-black">
                  <Sparkles size={9} /> DESTAQUE
                </span>
              </div>
            )}

            <div className="mb-3 flex items-center gap-3">
              <span className="text-4xl">{a.icon}</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold leading-tight text-white">{a.desc}</h3>
              </div>
            </div>

            <div className="mt-auto flex items-baseline gap-1">
              <span className="font-brush text-2xl text-red-500 blood-glow">{a.price}</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openPayment({
                    name: a.desc,
                    price: a.price,
                    category: "Free Fire",
                    notice: SETTINGS.freefireNotice,
                  })
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition"
              >
                <QrCode className="h-3 w-3" /> Comprar com PIX
              </motion.button>
              <AddToCartButton
                product={{
                  id: `freefire-${a.desc}`,
                  name: a.desc,
                  price: a.price,
                  category: "Free Fire",
                  emoji: a.icon,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-4 text-center text-xs text-yellow-200">
        <span className="font-bold uppercase tracking-widest text-yellow-400">⚠️ Aviso:</span>{" "}
        {SETTINGS.freefireNotice}
      </div>

      <CTABox
        title={
          <>
            No melhor Theus, pra vir com <span className="text-red-500">ADM THEUS!</span>
          </>
        }
        subtitle="Não achou o que procura? Fale com a gente, temos muito mais em estoque!"
        message="Olá ADM Theus, quero comprar uma conta de Free Fire!"
      />
    </section>
  );
}

/* =========================================================================
   ENGAGEMENT
   ========================================================================= */
function EngagementSection() {
  const { openPayment } = usePayment();
  return (
    <section id="engagement">
      <SectionHeader
        badge="📱 Engajamento Redes Sociais"
        title="Mais presença. Mais resultados."
        display="SEU PERFIL NO TOPO!"
        subtitle={
          <>
            Tabela oficial para <strong className="text-red-400">Instagram</strong>. Para outras
            plataformas (TikTok, YouTube, Facebook, Kwai, Twitter, etc.){" "}
            <strong className="text-red-400">chame no meu contato para mais informações!</strong>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-8 flex items-center justify-center gap-3 rounded-xl border border-red-900/40 bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-orange-950/40 p-4 animate-glow-border"
      >
        <Camera className="h-8 w-8 text-pink-400" />
        <div>
          <div className="font-brush text-xl text-white">Tabela Instagram Oficial</div>
          <div className="text-xs text-slate-400">
            Preços especiais para seguidores, curtidas e visualizações
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <EngagementTable
          title="SEGUIDORES"
          icon={<Users className="h-6 w-6" />}
          items={followers}
          openPayment={openPayment}
        />
        <EngagementTable
          title="CURTIDAS"
          icon={<Heart className="h-6 w-6" />}
          items={likes}
          openPayment={openPayment}
        />
        <EngagementTable
          title="VISUALIZAÇÕES"
          subtitle="Fotos / Reels"
          icon={<Eye className="h-6 w-6" />}
          items={views}
          openPayment={openPayment}
          footerNote="Quer mais do que 50.000 visualizações? Chame no WhatsApp para mais informações."
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <InfoCard
          icon={<Shield />}
          title="Qualidade que você vê"
          content={
            <>
              <strong className="text-red-400">Mundiais:</strong> entrega rápida e barata, ideal
              para números.
              <br />
              <strong className="text-red-400">Brasileiros:</strong> perfis nacionais, ótimos para
              engajamento local.
              <br />
              <strong className="text-red-400">Reais / orgânicos:</strong> perfis ativos que
              interagem de verdade.
            </>
          }
        />
        <InfoCard
          icon={<Zap />}
          title="Resultados que você sente"
          content="Reposição garantida em até 30 dias. Sem risco para sua conta. Entrega gradual e natural para o algoritmo aceitar tranquilamente. Aumente sua credibilidade e alcance orgânico!"
        />
      </div>

      <CTABox
        title={
          <>
            Quer engajamento em <span className="text-red-500">outra rede social?</span>
          </>
        }
        subtitle="TikTok, YouTube, Facebook, Kwai, Twitter e mais! Chame no meu contato para orçamento personalizado."
        message="Olá ADM Theus, quero saber sobre engajamento em outras redes sociais!"
        buttonText="Chama no Direct"
      />
    </section>
  );
}

function EngagementTable({
  title,
  subtitle,
  icon,
  items,
  openPayment,
  footerNote,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  items: { label: string; price: string; unit: string }[];
  openPayment: (product: {
    name: string;
    price: string;
    category?: string;
    notice?: string;
  }) => void;
  footerNote?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="shine-card tilt-hover overflow-hidden rounded-xl border border-red-900/40 bg-gradient-to-br from-red-950/60 to-black/60 backdrop-blur"
    >
      <div className="flex items-center gap-3 border-b border-red-900/60 bg-red-950/40 px-5 py-3">
        <span className="text-red-500">{icon}</span>
        <div>
          <h3 className="font-brush text-2xl leading-tight text-red-500 blood-glow">{title}</h3>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="divide-y divide-red-900/20">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 transition hover:bg-red-950/30"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-red-500/60">{icon}</span>
              <span className="text-sm font-semibold text-white">{it.label}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right">
                <span className="font-brush text-lg text-red-500">{it.price}</span>
                <span className="ml-1 text-xs text-slate-500">{it.unit}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    openPayment({ name: it.label, price: it.price, category: `Engajamento — ${title}` })
                  }
                  className="flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-red-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-red-600/30 transition hover:scale-105"
                >
                  <QrCode size={10} /> Comprar
                </button>
                <AddToCartButton
                  size="sm"
                  product={{
                    id: `engagement-${title}-${it.label}`,
                    name: it.label,
                    price: it.price,
                    category: `Engajamento — ${title}`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {footerNote && (
        <div className="border-t border-yellow-500/20 bg-yellow-950/10 px-4 py-2.5 text-center text-[11px] text-yellow-200">
          <AlertTriangle className="mr-1 inline h-3 w-3 text-yellow-400" />
          {footerNote}
        </div>
      )}
      <div className="border-t border-red-900/40 bg-black/40 p-3">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={whatsLink(
            `Olá ADM Theus, preciso de uma quantidade personalizada de ${title.toLowerCase()} no Instagram!`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-md border border-green-600/50 bg-green-950/20 py-2 text-xs font-bold uppercase tracking-wider text-green-400 transition hover:bg-green-600 hover:text-white"
        >
          <WhatsIcon className="h-4 w-4" /> Quantidade personalizada
        </motion.a>
      </div>
    </motion.div>
  );
}

function InfoCard({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-red-900/40 bg-black/60 p-6 backdrop-blur transition hover:border-red-500/50"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-950/60 text-red-500">
          {icon}
        </span>
        <h3 className="font-brush text-xl text-white">{title}</h3>
      </div>
      <p className="text-sm text-slate-400">{content}</p>
    </motion.div>
  );
}

/* =========================================================================
   BOTS
   ========================================================================= */
function BotsSection() {
  const { openPayment } = usePayment();
  return (
    <section id="bots">
      <SectionHeader
        badge="🤖 Bots WhatsApp"
        title="Automatize seu WhatsApp"
        subtitle="Bots profissionais para automatizar seu atendimento, vendas e grupos. Escolha o plano ideal para o seu negócio."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 md:grid-cols-3"
      >
        {botPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className={`shine-card relative flex flex-col overflow-hidden rounded-xl border p-6 transition-all ${
              plan.highlight
                ? "border-red-500/60 bg-gradient-to-b from-red-950/80 to-black/90 shadow-2xl shadow-red-600/30 animate-pulse-red"
                : "border-red-900/40 bg-black/70 hover:border-red-500/40"
            }`}
          >
            {plan.badge && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-red-500 to-red-700 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
              >
                <Sparkles className="mr-1 inline h-3 w-3" /> {plan.badge}
              </motion.div>
            )}
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg shadow-red-600/30">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-brush text-3xl text-white">{plan.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-widest text-red-400">{plan.tagline}</p>
            <div className="my-5 flex items-baseline gap-2">
              <span className="font-brush text-5xl text-red-500 blood-glow">{plan.price}</span>
              <span className="text-xs text-slate-500">/ único</span>
            </div>
            <ul className="flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openPayment({ name: plan.name, price: plan.price, category: "Bots WhatsApp" })
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-widest transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/40"
                    : "bg-white/10 text-white hover:bg-red-600"
                }`}
              >
                <QrCode className="h-4 w-4" />
                Contratar com PIX
              </motion.button>
              <AddToCartButton
                size="md"
                product={{
                  id: `bot-${plan.name}`,
                  name: plan.name,
                  price: plan.price,
                  category: "Bots WhatsApp",
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <CTABox
        title="Tá em dúvida sobre qual bot escolher?"
        subtitle="Chama no meu WhatsApp que eu te ajudo a escolher o melhor para o seu negócio!"
        message="Olá ADM Theus, quero ajuda para escolher um bot de WhatsApp!"
        buttonText="Falar com o ADM"
      />
    </section>
  );
}

/* =========================================================================
   SITES PERSONALIZADOS
   ========================================================================= */
function SitesSection() {
  const { openPayment } = usePayment();
  return (
    <section id="sites">
      <SectionHeader
        badge="🖥️ Sites Personalizados"
        title="Sites do jeitinho que você quer"
        subtitle={
          <>
            Sites profissionais, responsivos e{" "}
            <strong className="text-red-400">100% personalizados</strong> pra você ou seu negócio.
            Entrega rápida com o toque especial do <strong className="text-red-400">ADM Theus</strong>.
          </>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
      >
        {siteItems.map((s) => (
          <motion.div
            key={s.name}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className={`shine-card relative flex flex-col overflow-hidden rounded-xl border p-6 transition-all ${
              s.highlight
                ? "border-red-500/60 bg-gradient-to-b from-red-950/80 to-black/90 shadow-2xl shadow-red-600/30 animate-pulse-red"
                : "border-red-900/40 bg-black/70 hover:border-red-500/40"
            }`}
          >
            {s.badge && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-red-500 to-red-700 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
              >
                <Sparkles className="mr-1 inline h-3 w-3" /> {s.badge}
              </motion.div>
            )}

            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-red-900 text-3xl shadow-lg shadow-blue-600/30">
                {s.icon}
              </div>
              <div>
                <h3 className="font-brush text-2xl text-white leading-tight">{s.name}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-widest text-red-400">
                  {s.tagline}
                </p>
              </div>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="font-brush text-5xl text-red-500 blood-glow">{s.price}</span>
              <span className="text-xs text-slate-500">/ único</span>
            </div>

            <ul className="flex-1 space-y-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openPayment({ name: s.name, price: s.price, category: "Sites Personalizados" })
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-widest transition ${
                  s.highlight
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-600/40"
                    : "bg-white/10 text-white hover:bg-red-600"
                }`}
              >
                <QrCode className="h-4 w-4" />
                Encomendar com PIX
              </motion.button>
              <AddToCartButton
                size="md"
                product={{
                  id: `site-${s.name}`,
                  name: s.name,
                  price: s.price,
                  category: "Sites Personalizados",
                  emoji: s.icon,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Como funciona */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 overflow-hidden rounded-xl border border-red-900/40 bg-black/70 backdrop-blur"
      >
        <div className="border-b border-red-900/60 bg-red-950/40 px-5 py-3">
          <h3 className="font-brush text-2xl text-red-500 blood-glow flex items-center gap-2">
            <Award className="h-6 w-6" /> Como funciona
          </h3>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-4">
          {[
            { n: "1", t: "Você escolhe", d: "Nos conta o tema, estilo e cores que deseja no site." },
            { n: "2", t: "A gente cria", d: "Desenvolvemos seu site com muito capricho e detalhe." },
            { n: "3", t: "Você aprova", d: "Enviamos uma prévia e ajustamos o que for necessário." },
            { n: "4", t: "Site no ar", d: "Publicamos e entregamos o site pronto pra usar!" },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-lg border border-red-900/30 bg-red-950/10 p-4 transition hover:border-red-500/40"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 font-black text-white shadow-lg shadow-red-600/30">
                {step.n}
              </div>
              <div className="font-bold text-white">{step.t}</div>
              <div className="mt-1 text-xs text-slate-400">{step.d}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <CTABox
        title={
          <>
            Quer um site <span className="text-red-500">exclusivo?</span>
          </>
        }
        subtitle="Fala com o ADM Theus, conta sua ideia e recebe um orçamento personalizado em minutos!"
        message="Olá ADM Theus, quero encomendar um site personalizado!"
        buttonText="Falar com o ADM"
      />
    </section>
  );
}

/* =========================================================================
   NÚMEROS VIRTUAIS
   ========================================================================= */
function VirtualNumbersSection() {
  const { openPayment } = usePayment();
  return (
    <section id="numbers">
      <SectionHeader
        badge="📱 Números Virtuais"
        title="Números Virtuais"
        subtitle={
          <>
            Números para <strong className="text-red-400">ativação de contas e aplicativos</strong>,
            entrega imediata via chat.
          </>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2"
      >
        {virtualNumbers.map((n) => (
          <motion.div
            key={n.label}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className={`shine-card relative flex flex-col overflow-hidden rounded-xl border p-6 transition-all ${
              n.highlight
                ? "border-yellow-500/50 bg-gradient-to-b from-red-950/70 to-black/90 shadow-lg shadow-yellow-500/10"
                : "border-red-900/40 bg-black/70 hover:border-red-500/50 backdrop-blur"
            }`}
          >
            {n.highlight && (
              <div className="mb-2 flex flex-wrap gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[9px] font-black uppercase text-black">
                  <Sparkles size={9} /> POPULAR
                </span>
              </div>
            )}

            <div className="mb-3 flex items-center gap-3">
              <span className="text-4xl">{n.icon}</span>
              <div className="flex-1">
                <h3 className="text-base font-bold leading-tight text-white">{n.label}</h3>
                <p className="mt-1 text-xs text-slate-400">{n.desc}</p>
              </div>
            </div>

            <div className="mt-auto flex items-baseline gap-1">
              <span className="font-brush text-3xl text-red-500 blood-glow">{n.price}</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  openPayment({ name: n.label, price: n.price, category: "Números Virtuais" })
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition"
              >
                <QrCode className="h-3 w-3" /> Comprar com PIX
              </motion.button>
              <AddToCartButton
                product={{
                  id: `number-${n.label}`,
                  name: n.label,
                  price: n.price,
                  category: "Números Virtuais",
                  emoji: n.icon,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <CTABox
        title={
          <>
            Precisa de outro <span className="text-red-500">tipo de número?</span>
          </>
        }
        subtitle="Fala com a gente no WhatsApp que a gente resolve pra você!"
        message="Olá ADM Theus, quero comprar um número virtual!"
      />
    </section>
  );
}

/* =========================================================================
   TRÁFEGO PARA WEBSITE
   ========================================================================= */
function TrafficSection() {
  const { openPayment } = usePayment();
  return (
    <section id="traffic">
      <SectionHeader
        badge="📈 Tráfego para Website 🇧🇷"
        title="Tráfego para Website"
        subtitle={
          <>
            Aumente as visitas do seu site com tráfego vindo de{" "}
            <strong className="text-red-400">fontes reais e reconhecidas</strong> como Google,
            Facebook, Instagram e muito mais. Entrega gradual e segura.
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-red-900/40 bg-black/70 backdrop-blur"
      >
        <div className="hidden grid-cols-12 gap-2 border-b border-red-900/60 bg-gradient-to-r from-red-950/80 to-black/80 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-400 md:grid">
          <div className="col-span-6">Origem do Tráfego</div>
          <div className="col-span-3 text-center">Preço</div>
          <div className="col-span-3 text-right">Ação</div>
        </div>

        <div className="divide-y divide-red-900/20">
          {trafficItems.map((t, i) => {
            const label = t.variant ? `${t.source} (${t.variant})` : t.source;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition hover:bg-red-950/20"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Tráfego vindo de {label}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">
                      A cada 1.000 visitas
                    </div>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="font-brush text-lg text-red-500 blood-glow">
                    {t.price}
                    <span className="ml-1 text-xs text-slate-500">{t.unit}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        openPayment({
                          name: `Tráfego vindo de ${label} (1000 visitas)`,
                          price: t.price,
                          category: "Tráfego-website",
                        })
                      }
                      className="flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-red-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-red-600/30 transition hover:scale-105"
                    >
                      <QrCode size={10} /> Comprar
                    </button>
                    <AddToCartButton
                      size="sm"
                      product={{
                        id: `traffic-${i}-${t.source}`,
                        name: `Tráfego vindo de ${label} (1000 visitas)`,
                        price: t.price,
                        category: "Tráfego-website",
                        emoji: t.emoji,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-blue-500/20 bg-blue-950/20 p-4 text-center text-xs text-slate-300">
        <span className="font-bold uppercase tracking-widest text-blue-400">ℹ️ Como funciona:</span>{" "}
        O tráfego é entregue de forma gradual e natural, simulando visitantes reais vindos da
        fonte escolhida. Ideal para monetização, métricas e credibilidade do site.
      </div>

      <CTABox
        title={
          <>
            Precisa de um <span className="text-red-500">volume maior de tráfego?</span>
          </>
        }
        subtitle="Fala com a gente no WhatsApp para um orçamento personalizado de acordo com sua necessidade!"
        message="Olá ADM Theus, quero saber sobre tráfego para o meu site!"
      />
    </section>
  );
}

/* =========================================================================
   TRUST BAR
   ========================================================================= */
function TrustBar() {
  const items = [
    { icon: <Shield />, title: "Garantia de 48h", desc: "Segurança em todas as compras" },
    { icon: <Lock />, title: "Entrega Rápida", desc: "Em minutos após pagamento" },
    { icon: <Handshake />, title: "Suporte Humanizado", desc: "Seg a Sex • 12h às 20h" },
    { icon: <Rocket />, title: "Melhor Preço", desc: "Preços imbatíveis" },
  ];
  return (
    <section className="relative z-10 border-y border-red-900/40 bg-black/80 backdrop-blur">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 py-8"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: "rgba(239, 68, 68, 0.6)" }}
              className="flex items-center gap-3 rounded-lg border border-red-900/30 bg-red-950/20 p-4 transition"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900 text-white shadow-lg shadow-red-600/30">
                {it.icon}
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider text-red-400">
                  {it.title}
                </div>
                <div className="text-xs text-slate-400">{it.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   TESTIMONIALS
   ========================================================================= */
function Testimonials() {
  const reviews = [
    {
      n: "Lucas M.",
      c: "Comprei uma conta LV2800 com Godhuman e chegou em 10 minutos, tudo certinho! O ADM Theus é gente boa demais.",
      product: "Conta Blox Fruits",
    },
    {
      n: "Amanda R.",
      c: "Assinei Netflix e Spotify com o Theus, tá funcionando perfeito! Muito mais barato que oficial.",
      product: "Streaming",
    },
    {
      n: "Pedro H.",
      c: "O bot médio mudou minha loja! Agora atendo enquanto durmo. Fácil de usar e o suporte é rápido.",
      product: "Bot WhatsApp Médio",
    },
    {
      n: "Julia S.",
      c: "Comprei o Gemini IA por 10 meses e é sensacional! Chegou o link no e-mail rapidinho.",
      product: "Google Gemini IA",
    },
    {
      n: "Rafael B.",
      c: "Curtidas brasileiras premium são de qualidade, entrega gradual e sem risco. Melhor loja que já usei.",
      product: "Curtidas Premium",
    },
    {
      n: "Beatriz L.",
      c: "HBO Max e Disney+ funcionando 100%! Já é a segunda vez que compro e sempre atende as expectativas.",
      product: "Streaming",
    },
  ];
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="font-brush text-4xl text-white blood-glow sm:text-5xl">
          O que dizem meus clientes
        </h2>
        <div className="mt-2 flex items-center justify-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
          <span className="ml-2 text-sm font-bold text-slate-300">
            4.9/5 • +500 avaliações
          </span>
        </div>
      </motion.div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {reviews.map((r) => (
          <motion.div
            key={r.n}
            variants={fadeUp}
            whileHover={{ y: -6, borderColor: "rgba(239, 68, 68, 0.5)" }}
            className="shine-card rounded-xl border border-red-900/40 bg-gradient-to-b from-red-950/30 to-black/70 p-5 backdrop-blur"
          >
            <div className="mb-2 flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm italic text-slate-300">"{r.c}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-800 text-sm font-black text-white shadow-lg shadow-red-600/30">
                {r.n[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{r.n}</div>
                <div className="text-[10px] uppercase tracking-widest text-red-500">
                  {r.product}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* =========================================================================
   FAQ
   ========================================================================= */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {
      q: "Como funciona a garantia de 48h?",
      a: "Todos os produtos possuem 48h de garantia após a entrega. Se der qualquer problema neste período, é só chamar no suporte que a gente resolve.",
    },
    {
      q: "Como funciona a entrega das contas de streaming?",
      a: "Após o pagamento confirmado (PIX é instantâneo), enviamos o e-mail e senha pelo WhatsApp em poucos minutos. Alguns produtos como o Gemini vêm com link de ativação enviado ao seu e-mail.",
    },
    {
      q: "Vocês fazem reembolso?",
      a: "Não realizamos reembolsos via Pix. Também não reembolsamos compras erradas, então escolha com muito cuidado antes de finalizar a compra.",
    },
    {
      q: "Qual o horário de atendimento do suporte?",
      a: "Nosso suporte funciona de segunda a sexta-feira, das 12:00 às 20:00. Fora desse horário, você pode enviar sua dúvida e responderemos assim que possível.",
    },
    {
      q: "As contas Blox Fruits são banidas?",
      a: "Não! Todas as nossas contas são criadas e upadas manualmente por jogadores reais, sem uso de hacks. É 100% seguro.",
    },
    {
      q: "Formas de pagamento?",
      a: "Aceitamos PIX (aprovação em segundos), cartão de crédito e transferência bancária. PIX é o método mais rápido e recomendado.",
    },
  ];
  return (
    <section id="faq" className="relative z-10 mx-auto max-w-4xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 text-center"
      >
        <h2 className="font-brush text-4xl text-white blood-glow sm:text-5xl">
          Perguntas Frequentes
        </h2>
        <p className="mt-2 text-sm text-slate-400">Tirando suas principais dúvidas</p>
      </motion.div>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-xl border border-red-900/40 bg-black/70 backdrop-blur transition hover:border-red-500/40"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="font-bold text-white">{f.q}</span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
              >
                <Plus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-red-900/30 bg-red-950/10"
                >
                  <p className="px-5 py-4 text-sm text-slate-300">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   FINAL CTA
   ========================================================================= */
function FinalCTA() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-br from-red-700 via-red-900 to-black p-10 text-center shadow-2xl shadow-red-600/40"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-red-500/40 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-red-800/40 blur-3xl"
        />

        <div className="relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-3 inline-block"
          >
            <Flame className="h-14 w-14 text-yellow-400" />
          </motion.div>
          <h2 className="font-brush text-4xl text-white blood-glow sm:text-6xl">
            Bora fechar negócio?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Chama agora no WhatsApp e ganhe <strong>desconto especial</strong> na sua primeira
            compra! Atendimento rápido e humanizado direto com o ADM Theus.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={whatsLink("Olá ADM Theus, quero meu desconto de primeira compra!")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-black uppercase tracking-widest text-red-700 shadow-xl"
            >
              <WhatsIcon className="h-5 w-5" />
              {CONTACT.whatsappDisplay}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 rounded-lg border-2 border-white/50 bg-white/10 px-8 py-3 font-black uppercase tracking-widest text-white backdrop-blur transition hover:bg-white/20"
            >
              <Mail className="h-5 w-5" />
              E-mail
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-red-900/40 bg-black/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-900 font-black text-white shadow-lg shadow-red-600/50">
                TH
              </div>
              <div>
                <div className="font-brush text-xl text-white blood-glow">TH Vendas</div>
                <div className="text-[10px] uppercase tracking-widest text-red-500">
                  ADM THEUS
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Qualidade e confiança, só aqui. Sua loja de streaming, contas Blox Fruits, engajamento
              e bots de WhatsApp.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">
              Categorias
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Film size={12} className="text-purple-400" /> Streaming
              </li>
              <li className="flex items-center gap-2">
                <Flame size={12} className="text-red-400" /> Contas Blox Fruits
              </li>
              <li className="flex items-center gap-2">
                <Camera size={12} className="text-pink-400" /> Engajamento
              </li>
              <li className="flex items-center gap-2">
                <Bot size={12} className="text-green-400" /> Bots WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <Globe size={12} className="text-blue-400" /> Sites Personalizados
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <WhatsIcon className="h-4 w-4 text-green-500" />
                <a
                  href={whatsLink("Olá!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400"
                >
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-500" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all hover:text-red-400"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-pink-500" />
                <span>@{CONTACT.instagram}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-red-500">
              Atendimento
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Segunda a Sexta</li>
              <li className="font-bold text-white">12:00 às 20:00</li>
              <li className="flex items-center gap-2 font-bold text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Online agora
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-red-900/30 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TH Vendas - ADM Theus. Todos os direitos reservados.</p>
          <p className="mt-1">
            Não somos afiliados às plataformas mencionadas. Todos os produtos e serviços são
            independentes.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   FLOATING WHATSAPP
   ========================================================================= */
function FloatingWhatsApp() {
  return (
    <motion.a
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={whatsLink("Olá ADM Theus, tudo bem?")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 shadow-2xl shadow-green-500/50"
      aria-label="WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-400 opacity-40" />
      <WhatsIcon className="h-6 w-6 text-white" />
      <span className="hidden text-sm font-bold text-white sm:inline">Chama no Zap</span>
    </motion.a>
  );
}

/* =========================================================================
   REUSABLE COMPONENTS
   ========================================================================= */
function SectionHeader({
  badge,
  title,
  display,
  subtitle,
}: {
  badge: string;
  title: string;
  display?: string;
  subtitle: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 text-center"
    >
      <div className="mb-3 inline-block rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-red-400">
        {badge}
      </div>
      <h2 className="font-brush text-4xl text-white blood-glow sm:text-5xl">{title}</h2>
      {display && (
        <p className="mx-auto mt-3 max-w-xl font-display text-lg tracking-widest text-red-500">
          {display}
        </p>
      )}
      <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400">{subtitle}</p>
    </motion.div>
  );
}

function AddToCartButton({
  product,
  size = "md",
}: {
  product: CartProductInput;
  size?: "sm" | "md";
}) {
  const { addItem, justAddedId } = useCart();
  const justAdded = justAddedId === product.id;
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? 12 : 15;

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        addItem(product);
      }}
      title="Adicionar ao carrinho"
      aria-label="Adicionar ao carrinho"
      className={`flex ${dims} flex-shrink-0 items-center justify-center rounded-md border transition ${
        justAdded
          ? "border-green-500 bg-green-600 text-white"
          : "border-red-500/50 bg-black/60 text-red-400 hover:border-red-400 hover:bg-red-950 hover:text-white"
      }`}
    >
      {justAdded ? <Check size={iconSize} /> : <ShoppingCart size={iconSize} />}
    </motion.button>
  );
}

function CTABox({
  title,
  subtitle,
  message,
  buttonText = "Comprar Agora no WhatsApp",
}: {
  title: React.ReactNode;
  subtitle: string;
  message: string;
  buttonText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 rounded-xl border border-red-900/40 bg-gradient-to-br from-red-950/60 to-black/60 p-6 text-center backdrop-blur"
    >
      <p className="font-brush text-2xl text-white blood-glow">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={whatsLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 px-8 py-3 font-bold uppercase tracking-wider text-white shadow-lg shadow-green-500/40"
      >
        <WhatsIcon className="h-5 w-5" />
        {buttonText}
      </motion.a>
    </motion.div>
  );
}
