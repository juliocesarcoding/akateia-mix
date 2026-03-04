"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type MeUser = {
  id: string;
  steamId?: string | null;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  nickname?: string | null;
  phone?: string | null;
  profileCompleted?: boolean;

};

export default function CompleteProfilePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const tokenFromQuery = sp.get("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [me, setMe] = useState<MeUser | null>(null);

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return tokenFromQuery || localStorage.getItem("auth_token");
  }, [tokenFromQuery]);

  // 1) salva token vindo da query e limpa a URL
  useEffect(() => {
    if (!tokenFromQuery) return;
    try {
      localStorage.setItem("auth_token", tokenFromQuery);
      // remove o token da URL (mais seguro/limpo)
      router.replace("/complete-profile");
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromQuery]);

  // 2) busca /auth/me
  useEffect(() => {
    async function run() {
      setError(null);
      setLoading(true);

      if (!apiUrl) {
        setError("NEXT_PUBLIC_API_URL não configurado no front.");
        setLoading(false);
        return;
      }
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(data?.message || "Não foi possível carregar seu usuário (/auth/me).");
          setLoading(false);
          return;
        }

        const user: MeUser = data.user;
        setMe(user);

        // se já está completo, manda direto
        if (user?.profileCompleted) {
          router.replace("/queue");
          return;
        }

        setNickname(user.nickname || user.displayName || "");
        setPhone(user.phone || "");
      } catch {
        setError("Erro de rede ao carregar /auth/me.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [apiUrl, token, router]);

  async function handleSave() {
    setError(null);

    if (!apiUrl) return setError("NEXT_PUBLIC_API_URL não configurado.");
    if (!token) return setError("Token não encontrado. Faça login novamente.");

    // validações simples
    if (!nickname.trim()) return setError("Informe um nickname.");
    if (nickname.trim().length < 3) return setError("Nickname precisa ter pelo menos 3 caracteres.");

    if (phone && phone.trim().length < 10) return setError("Telefone precisa ter pelo menos 10 caracteres.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("E-mail inválido.");

    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/users/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          nickname: nickname.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Falha ao salvar cadastro.");
        setSaving(false);
        return;
      }

      router.replace("/queue");
    } catch {
      setError("Erro de rede ao salvar cadastro.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-white">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/12 blur-3xl" />
        <div className="absolute top-40 left-12 h-[340px] w-[340px] rounded-full bg-orange-400/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-orange-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-2xl flex-col px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-300 shadow-[0_0_35px_rgba(249,115,22,0.25)]" />
          <div className="leading-tight">
            <h1 className="text-xl font-semibold tracking-tight">AKtéia</h1>
            <p className="text-sm text-zinc-400">Completar cadastro</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-5 w-56 rounded bg-zinc-800/60" />
              <div className="mt-4 h-10 w-full rounded bg-zinc-800/50" />
              <div className="mt-3 h-10 w-full rounded bg-zinc-800/50" />
              <div className="mt-6 h-10 w-40 rounded bg-zinc-800/50" />
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-lg font-semibold">Só mais um passo</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Recomendado para liberar acesso ao mix/discord e evitar contas duplicadas.
                </p>
              </div>

              {me?.steamId ? (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                  {me.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={me.avatarUrl}
                      alt="Avatar Steam"
                      className="h-10 w-10 rounded-full border border-zinc-800 object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">
                      {me.displayName || "Conta Steam conectada"}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">SteamID: {me.steamId}</p>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="mb-4 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    Nickname (obrigatório)
                  </label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex: JulioAK"
                    disabled={true}
                    className="w-full rounded-xl border  border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-orange-500/70 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                  />
                </div>


                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    E-mail (Obrigatório)
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@dominio.com"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-orange-500/70 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                  />

                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-300">
                    WhatsApp (opcional)
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-orange-500/70 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Usado só para contato/admin (se você quiser deixar isso claro na comunidade).
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_35px_rgba(249,115,22,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar e continuar"}
                </button>

                <button
                  onClick={() => router.replace("/queue")}
                  className="text-sm text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
                >
                  Pular por enquanto
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-400">
                  <span className="text-orange-300/90 font-medium">Dica:</span>{" "}
                  se você logou com Steam, sua conta já fica vinculada automaticamente.
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          AKtéia • fogo no servidor, zero toxidade 😄
        </p>
      </div>
    </div>
  );
}