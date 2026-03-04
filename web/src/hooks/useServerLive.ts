"use client";

import { useEffect, useState } from "react";

type ServerLive = {
 serverId: string;
 playerCount: number;
 updatedAt: number;
 online: boolean;
};

export function useServersLive() {
 const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
 const [data, setData] = useState<Record<string, ServerLive>>({});

 useEffect(() => {
  const es = new EventSource(`${apiUrl}/servers/live`, {
   withCredentials: true,
  });

  es.onmessage = (event) => {
   try {
    const parsed: ServerLive[] = JSON.parse(event.data);

    const map: Record<string, ServerLive> = {};
    parsed.forEach((s) => {
     map[s.serverId] = s;
    });

    setData(map);
   } catch (e) {
    console.error("Erro SSE:", e);
   }
  };

  es.onerror = () => {
   console.warn("SSE reconectando...");
  };

  return () => es.close();
 }, [apiUrl]);

 return data;
}
