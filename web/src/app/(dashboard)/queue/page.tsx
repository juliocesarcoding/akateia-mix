import { Suspense } from "react";
import QueueClient from "./QueueClient";

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black p-6 text-sm text-zinc-400">Carregando...</div>}>
      <QueueClient />
    </Suspense>
  );
}