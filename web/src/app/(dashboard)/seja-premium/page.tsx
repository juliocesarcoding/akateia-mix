"use client";

import { useMemo, useState } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SejaPremiumPage() {
  // Placeholder (troque quando tiver o link oficial)
  const WHATSAPP_LINK =
    process.env.NEXT_PUBLIC_WHATSAPP_PREMIUM || "https://wa.me/55SEUNUMERO";

  const [copied, setCopied] = useState(false);

  const message = useMemo(() => {
    return encodeURIComponent(
      "Fala! Quero virar Premium na AKTÉIA MIX. Como faço pra entrar e quais são os benefícios?"
    );
  }, []);

  const whatsappHref = useMemo(() => {
    // garante que abre já com mensagem
    if (WHATSAPP_LINK.includes("?")) return `${WHATSAPP_LINK}&text=${message}`;
    return `${WHATSAPP_LINK}?text=${message}`;
  }, [WHATSAPP_LINK, message]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background glow (padrão AKTÉIA) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-220px] left-1/2 -translate-x-1/2 h-[560px] w-[560px] rounded-full bg-orange-500/10 blur-[150px]" />
        <div className="absolute bottom-[-240px] right-[-160px] h-[620px] w-[620px] rounded-full bg-orange-600/10 blur-[170px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black" />
      </div>

      {/* Conteúdo */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-14">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl border border-orange-500/20 bg-zinc-900/60 shadow-[0_0_40px_rgba(249,115,22,0.12)]" />
            <div className="leading-tight">
              <p className="text-sm text-zinc-400">AKTÉIA</p>
              <p className="text-base font-semibold tracking-wide">MIX</p>
            </div>
          </div>

          <a
            href="/discord"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Voltar
          </a>
        </div>

        {/* Hero */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-zinc-900/60 px-4 py-1 text-xs text-orange-400 backdrop-blur">
              Acesso Premium • Campeonatos • Mix Elite • Skins
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
              Seja <span className="text-orange-500">Premium</span> e jogue no
              padrão <span className="text-orange-500">AKTÉIA</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              Aqui não é “mais um servidor”. É um clube fechado com regras,
              gestão ativa e uma comunidade que joga sério.
              <span className="text-white"> Premium é para quem quer o melhor.</span>
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-7 py-4 text-base font-semibold text-black shadow-[0_0_40px_rgba(249,115,22,0.55)] transition-all hover:bg-orange-400 hover:scale-[1.02]"
              >
                Quero virar Premium (WhatsApp)
              </a>

              <button
                onClick={() =>
                  copy("Quero virar Premium na AKTÉIA MIX. Como faço pra entrar?")
                }
                className="inline-flex items-center justify-center rounded-xl border border-orange-500/30 bg-zinc-900/60 px-7 py-4 text-base font-semibold text-white/90 hover:bg-zinc-900"
              >
                {copied ? "Mensagem copiada ✅" : "Copiar mensagem para enviar ao WhatsApp"}
              </button>
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              Acesso moderado • Sem toxidade • Sem trapaça • Respeito obrigatório
            </p>
          </div>

          {/* Card destaque */}
          <div className="rounded-2xl border border-orange-500/25 bg-zinc-900/60 p-7 backdrop-blur-xl shadow-[0_0_60px_rgba(249,115,22,0.12)]">
            <h2 className="text-xl font-semibold text-white">
              Premium desbloqueia a melhor experiência
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Você entra numa camada acima do casual: onde o padrão é alto, e o
              jogo fica realmente bom.
            </p>

            <div className="mt-6 grid gap-4">
              <Feature
                title="🏆 Campeonatos exclusivos"
                text="Torneios internos, premiações e uma organização de verdade."
              />
              <Feature
                title="⚔️ Mix mais disputado"
                text="Partidas mais equilibradas, players comprometidos e nível acima."
              />
              <Feature
                title="🧠 Pessoas melhores"
                text="Menos caos, mais comunicação, mais foco em ganhar e evoluir."
              />
              <Feature
                title="✨ Skins liberadas"
                text="Acesso às skins que você deseja pra jogar com estilo e identidade."
              />
            </div>

            <div className="mt-6 rounded-xl border border-orange-500/20 bg-black/30 p-4">
              <p className="text-sm text-zinc-300">
                <span className="text-orange-400 font-semibold">Resumo:</span>{" "}
                Premium = melhor lobby, melhor clima, melhores jogos e a AKTÉIA do jeito que ela foi criada.
              </p>
            </div>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold">
            O que muda quando você vira <span className="text-orange-500">Premium</span>?
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Benefit
              title="Ambiente controlado (de verdade)"
              text="Regras claras, moderação ativa e zero espaço pra toxidade. Aqui o respeito não é opcional."
            />
            <Benefit
              title="Mix com padrão elite"
              text="Mais organização, menos bagunça. A experiência fica mais competitiva e prazerosa."
            />
            <Benefit
              title="Campeonatos e eventos"
              text="O Premium tem prioridade e acesso aos melhores campeonatos e eventos internos."
            />
            <Benefit
              title="Skins que você quer"
              text="Jogue com as skins que você deseja e tenha uma experiência mais completa dentro da comunidade."
            />
          </div>
        </div>

        {/* Como funciona */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold">Como entrar</h2>

          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            <Step
              n="1"
              title="Chama no WhatsApp"
              text="Você clica no botão e fala com a administração."
            />
            <Step
              n="2"
              title="Confirma o acesso Premium"
              text="A gente te orienta com tudo de forma rápida e simples."
            />
            <Step
              n="3"
              title="Entra no clube fechado"
              text="Você desbloqueia a melhor experiência do AKTÉIA MIX."
            />
          </ol>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-7 py-4 text-base font-semibold text-black shadow-[0_0_40px_rgba(249,115,22,0.55)] transition-all hover:bg-orange-400 hover:scale-[1.02]"
            >
              Falar com a administração
            </a>

          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-14 pb-6 text-center text-sm text-zinc-500">
          AKTÉIA MIX • Comunidade Premium • Respeito acima de tudo
        </footer>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-orange-500/20 bg-zinc-900/60 p-6 backdrop-blur">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="rounded-2xl border border-orange-500/20 bg-zinc-900/60 p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-black font-bold">
          {n}
        </div>
        <p className="text-white font-semibold">{title}</p>
      </div>
      <p className="mt-3 text-sm text-zinc-400">{text}</p>
    </li>
  );
}