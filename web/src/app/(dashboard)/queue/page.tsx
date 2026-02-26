"use client";

import { useEffect, useState } from "react";
import ServersSection from "@/components/ServersSection";

type SteamUser = {
  steamid: string;
  displayName: string;
  avatar?: string | null;
};

type MeResponse = { ok: true; user: SteamUser } | { ok: false; user: null };

export default function QueuePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/auth/me`, { method: "GET", credentials: "include" })
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ ok: false, user: null }));
  }, [apiUrl]);

  if (!me) return <div className="min-h-screen bg-black p-6 text-sm text-zinc-400">Carregando...</div>;

  if (!me.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
          <h1 className="text-xl font-semibold text-white">Fila do Mix</h1>
          <p className="mt-2 text-sm text-zinc-400">Você não está logado.</p>
          <a
            href="/login"
            className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-black hover:from-orange-400 hover:to-amber-300"
          >
            Entrar com Steam
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* background smoke/fire */}
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(255,140,0,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_15%_85%,rgba(255,80,0,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_45%_at_90%_75%,rgba(255,200,0,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
      </div>

      <div className="relative mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-[0_20px_80px_-60px_rgba(255,120,0,0.35)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-inset ring-white/10">
              <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(255,140,0,0.8)]" />
              AKtéia Mix  - fila
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Fila do Mix{" "}

            </h1>

            <p className="mt-2 text-sm text-zinc-300">
              Logado como{" "}
              <b className="text-white">{me.user.displayName}</b>{" "}
              <span className="text-zinc-500">({me.user.steamid})</span>
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Entra na fila pra fechar 10. Enquanto isso, aquece no Retake. 🔥
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-black hover:from-orange-400 hover:to-amber-300 active:scale-[0.99]"
                onClick={() => alert("Próximo passo: implementar /queue/join no backend")}
              >
                Entrar na fila
              </button>

              <button
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.99]"
                onClick={() => alert("Em breve: histórico, elo, stats e ranking")}
              >
                Ver meu perfil
              </button>
            </div>
          </div>

          {/* Avatar / badge */}
          <div className="flex items-center gap-4">
            {me.user.avatar ? (
              <img
                src={me.user.avatar}
                alt="avatar"
                width={76}
                height={76}
                className="rounded-2xl border border-white/10"
              />
            ) : (
              <div className="h-[76px] w-[76px] rounded-2xl border border-white/10 bg-white/5" />
            )}

            <div className="hidden md:block">
              <div className="text-xs font-semibold text-zinc-300">Status</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/25">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Autenticado via Steam
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                “AK-47 na mão, lag não.” (ainda)
              </div>
            </div>
          </div>
        </div>

        {/* Servers */}
        <ServersSection apiUrl={apiUrl} />

      </div>
    </div>
  );
}