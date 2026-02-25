"use client";

import { useEffect, useState } from "react";

type SteamUser = {
  steamid: string;
  displayName: string;
  avatar?: string | null;
};

type MeResponse = { ok: true; user: SteamUser } | { ok: false; user: null };

export default function QueuePage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      credentials: "include", // 🔥 importante pra mandar cookie de sessão
    })
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ ok: false, user: null }));
  }, [apiUrl]);

  if (!me) return <div style={{ padding: 20 }}>Carregando...</div>;

  if (!me.ok) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Fila do Mix</h1>
        <p>Você não está logado.</p>
        <a href="/login">Ir para login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Fila do Mix</h1>
      <p>
        Logado como <b>{me.user.displayName}</b> ({me.user.steamid})
      </p>

      {me.user.avatar ? (
        <img
          src={me.user.avatar}
          alt="avatar"
          width={72}
          height={72}
          style={{ borderRadius: 12, marginTop: 12 }}
        />
      ) : null}

      <div style={{ marginTop: 18 }}>
        <button
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #333",
            cursor: "pointer",
          }}
          onClick={() => alert("Próximo passo: implementar /queue/join no backend")}
        >
          Entrar na fila
        </button>
      </div>
    </div>
  );
}