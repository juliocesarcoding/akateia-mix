

import { Suspense, } from "react";

import CompleteProfileClient from "./CompleteProfileClient";

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Carregando...</div>}>
      <CompleteProfileClient />
    </Suspense>
  );
}