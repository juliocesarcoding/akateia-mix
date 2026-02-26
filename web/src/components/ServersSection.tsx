"use client";

import { useEffect, useMemo, useState } from "react";
import ServerCard, { ServerDTO } from "./ServerCard";

export default function ServersSection({
  apiUrl,
  title = "Servidores",
  subtitle = "Aquece no Retake enquanto o mix fecha.",
}: {
  apiUrl: string;
  title?: string;
  subtitle?: string;
}) {
  const [servers, setServers] = useState<ServerDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) return;

    let cancelled = false;

    (async () => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await fetch(`${apiUrl}/servers`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();
        if (cancelled) return;

        setServers(Array.isArray(data) ? data : []);
      } catch {
        if (cancelled) return;
        setError("Falha ao carregar servidores.");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const serversByMode = useMemo(() => {
    const onlineFirst = (a: ServerDTO, b: ServerDTO) =>
      Number(b.isActive) - Number(a.isActive);

    const retake = servers.filter((s) => s.mode === "RETAKE").sort(onlineFirst);
    const mix = servers.filter((s) => s.mode === "MIX").sort(onlineFirst);
    const dm = servers.filter((s) => s.mode === "DM").sort(onlineFirst);

    return { retake, mix, dm };
  }, [servers]);

  return (
    <div className="mt-10">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>

      {loading ? (
        <div className="text-sm text-zinc-400">Carregando servidores…</div>
      ) : error ? (
        <div className="text-sm text-red-400">{error}</div>
      ) : servers.length === 0 ? (
        <div className="text-sm text-zinc-400">Nenhum servidor cadastrado.</div>
      ) : (
        <div className="space-y-9">
          {serversByMode.retake.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">Retake</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {serversByMode.retake.map((s) => (
                  <ServerCard key={s.id} server={s} />
                ))}
              </div>
            </section>
          ) : null}

          {serversByMode.mix.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">Mix</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {serversByMode.mix.map((s) => (
                  <ServerCard key={s.id} server={s} />
                ))}
              </div>
            </section>
          ) : null}

          {serversByMode.dm.length > 0 ? (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">DM</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {serversByMode.dm.map((s) => (
                  <ServerCard key={s.id} server={s} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}