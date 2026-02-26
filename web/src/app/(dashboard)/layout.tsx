import Sidebar from "@/components/layout/SideBar";
import Footer from "@/components/layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0e0e0f] text-white">
      {/* Background global */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(60%_60%_at_20%_12%,rgba(255,140,0,0.18),transparent_58%)]" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(55%_55%_at_85%_20%,rgba(255,200,0,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0f] via-[#0b0b0c] to-black" />
      </div>

      {/* ✅ Estrutura anti-bug com GRID */}
      <div className="relative min-h-screen md:grid md:grid-cols-[18rem_1fr]">
        {/* Sidebar (coluna 1) */}
        <div className="md:row-span-2">
          <Sidebar discordUrl="https://discord.gg/SEU_INVITE" />
        </div>

        {/* Conteúdo (coluna 2) */}
        <main className="md:bg-white/[0.03]">
          {children}
        </main>

        {/* <Footer discordUrl="https://discord.gg/SEU_INVITE" /> */}


        {/* Footer (coluna 2, embaixo do conteúdo) */}
      </div>
    </div>
  );
}