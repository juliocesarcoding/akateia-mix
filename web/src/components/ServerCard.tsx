"use client";

import { useMemo, useState } from "react";

export type ServerMode = "MIX" | "RETAKE" | "DM";

export type ServerDTO = {
  id: string;
  name: string;
  ip: string;
  port: number;
  mode: ServerMode;
  region?: string | null;
  isActive: boolean;
};

function modeLabel(mode: ServerMode) {
  switch (mode) {
    case "MIX":
      return "Mix 5v5";
    case "RETAKE":
      return "Retake";
    case "DM":
      return "Deathmatch";
    default:
      return mode;
  }
}

function modePillClasses(mode: ServerMode) {
  // Pills pensadas pra dark theme
  switch (mode) {
    case "RETAKE":
      return "bg-orange-500/10 text-orange-300 ring-1 ring-orange-500/25";
    case "MIX":
      return "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25";
    case "DM":
      return "bg-slate-400/10 text-slate-200 ring-1 ring-slate-400/20";
    default:
      return "bg-slate-400/10 text-slate-200 ring-1 ring-slate-400/20";
  }
}

export default function ServerCard({ server }: { server: ServerDTO }) {
  const [copied, setCopied] = useState(false);

  const address = useMemo(() => `${server.ip}:${server.port}`, [server.ip, server.port]);
  const connectCmd = useMemo(() => `connect ${address}`, [address]);
  const cs2Url = useMemo(() => `steam://connect/${address}`, [address]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(connectCmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = connectCmd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  const statusText = server.isActive ? "Online" : "Offline";
  const statusClasses = server.isActive
    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/25"
    : "bg-slate-500/10 text-slate-300 ring-1 ring-slate-500/25";

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] backdrop-blur">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100">
        <div className="h-full w-full bg-gradient-to-r from-orange-500/25 via-amber-500/15 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{server.name}</h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${modePillClasses(server.mode)}`}>
              {modeLabel(server.mode)}
            </span>

            {server.region ? (
              <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200 ring-1 ring-inset ring-white/10">
                {server.region}
              </span>
            ) : null}

            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
              {statusText}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-zinc-400">Endereço</p>
            <p className="mt-1 font-mono text-sm text-zinc-100">{address}</p>
            <p className="mt-1 font-mono text-xs text-zinc-400">{connectCmd}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <a
            href={cs2Url}
            className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-black active:scale-[0.99] ${server.isActive
              ? "bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300"
              : "bg-zinc-700 text-zinc-300 pointer-events-none"
              }`}
            title={server.isActive ? "Abrir CS2 e conectar" : "Servidor offline"}
          >
            Abrir no CS2
          </a>

          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-100 hover:bg-white/10 active:scale-[0.99]"
          >
            {copied ? "Copiado!" : "Copiar connect"}
          </button>
        </div>
      </div>

      <div className="relative mt-4 border-t border-white/10 pt-4">
        <p className="text-xs text-zinc-400">
          Dica: console do CS2 → <span className="font-mono text-zinc-200">{connectCmd}</span>
        </p>
      </div>
    </div>
  );
}