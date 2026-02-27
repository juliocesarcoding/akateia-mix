"use client";

import { useEffect, useState } from "react";

type Live = {
 serverId: string;
 playerCount: number;
 updatedAt: number;
 online: boolean;
};

export function useServerLive(serverId: string) {
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
 const [live, setLive] = useState<Live | null>(null);

 useEffect(() => {
  if (!serverId) return;

  const url = `${apiUrl}/servers/${serverId}/live`;
  const es = new EventSource(url, { withCredentials: true });

  es.onmessage = (ev) => {
   try {
    const data = JSON.parse(ev.data);
    setLive(data);
   } catch {
    // se o Nest já mandar objeto, pode vir direto stringificado de forma diferente
   }
  };

  es.onerror = () => {
   // EventSource tenta reconectar automaticamente
  };

  return () => es.close();
 }, [apiUrl, serverId]);

 return live;
}
