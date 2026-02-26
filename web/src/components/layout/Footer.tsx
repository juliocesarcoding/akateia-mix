"use client";

import Link from "next/link";

export default function Footer({ discordUrl }: { discordUrl: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#111113]">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-orange-500/25 bg-gradient-to-br from-orange-500/30 to-amber-400/10">
              <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,140,0,0.35),transparent_60%)]" />
            </div>

            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-white">AKtéia</span>{" "}
              <span className="text-zinc-400">•</span>{" "}
              <span className="text-zinc-300">Mix Queue</span>{" "}
              <span className="text-zinc-500">© {year}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <Link href="/queue" className="text-zinc-300 hover:text-white">
              Início
            </Link>

            <Link href="/premium" className="text-orange-200 hover:text-orange-100">
              Seja Premium
            </Link>

            <Link href="/ajuda" className="text-zinc-300 hover:text-white">
              Ajuda
            </Link>

            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-300 hover:text-white"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}