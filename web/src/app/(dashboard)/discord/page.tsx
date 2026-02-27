"use client";

export default function DiscordLandingPage() {
  const DISCORD_INVITE =
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/ppZaVB3KHQ";

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Glow laranja no fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[160px]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-zinc-900/60 px-4 py-1 text-xs text-orange-400 backdrop-blur">
          Comunidade Competitiva • Ambiente Controlado • Padrão AKTÉIA
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold sm:text-6xl">
          Entre na <span className="text-orange-500">AKTÉIA MIX</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          A melhor comunidade de CS do Brasil.
          Organização real, partidas equilibradas e zero toxidade.
          Aqui você joga com quem leva o competitivo a sério.
        </p>

        {/* Card Premium */}
        <div className="mt-12 w-full max-w-3xl rounded-2xl border border-orange-500/30 bg-zinc-900/60 p-10 backdrop-blur-xl shadow-[0_0_60px_rgba(249,115,22,0.15)]">

          <h2 className="mb-6 text-2xl font-semibold text-orange-400">
            O que você encontra aqui
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 text-left text-zinc-400">
            <div>
              <h3 className="text-white font-medium mb-2">
                🔥 Ambiente Selecionado
              </h3>
              <p>
                Apenas jogadores comprometidos.
                Respeito é regra, não exceção.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">
                ⚔️ Mix Organizado
              </h3>
              <p>
                Sistema estruturado, partidas equilibradas
                e gestão ativa da comunidade.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">
                🧠 Mentalidade Competitiva
              </h3>
              <p>
                Evolução constante, aprendizado coletivo
                e foco em performance.
              </p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">
                👑 Experiência Premium
              </h3>
              <p>
                Estrutura diferenciada e comunidade fechada
                com padrão acima do casual.
              </p>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-orange-500/50 bg-orange-500 px-10 py-4 text-lg font-semibold text-black shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-300 hover:bg-orange-400 hover:scale-105"
          >
            Entrar no Discord
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            Acesso moderado. Comprometimento é obrigatório.
          </p>
        </div>

      </section>
    </main>
  );
}