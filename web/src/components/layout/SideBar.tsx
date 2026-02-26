"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  badge?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ discordUrl }: { discordUrl: string }) {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { label: "Início", href: "/queue" },
      { label: "Seja Premium", href: "/premium", badge: "NEW" },
      { label: "Ajuda", href: "/ajuda" },
      { label: "Discord", href: discordUrl, external: true },
    ],
    [discordUrl]
  );

  function isActive(item: NavItem) {
    if (item.external) return false;
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname?.startsWith(item.href + "/");
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-white/15 bg-zinc-950/70 p-4 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/35 to-amber-400/10">
              <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,140,0,0.35),transparent_60%)]" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">AKtéia</div>
              <div className="text-xs text-zinc-200">Mix Queue</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-zinc-200">
            Melhor server discord de CS do BR. <span className="text-orange-300">🔥</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 px-3">
        <div className="space-y-1.5">
          {items.map((item) => {
            const active = isActive(item);

            const base =
              "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition";
            const inactive =
              "text-white/90 hover:bg-white/10 hover:text-white";
            const activeCls =
              "bg-orange-500/10 text-white ring-1 ring-inset ring-orange-500/50 shadow-[0_0_18px_rgba(255,140,0,0.25)]";

            const leftGlow = active ? (
              <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-orange-500 to-amber-400 shadow-[0_0_18px_rgba(255,140,0,0.65)]" />
            ) : null;

            const content = (
              <>
                <span className="flex items-center gap-3">
                  <span
                    className={cx(
                      "relative flex h-7 w-7 items-center justify-center rounded-lg border transition",
                      active
                        ? "border-orange-500/35 bg-orange-500/15"
                        : "border-white/15 bg-white/5 group-hover:bg-white/10"
                    )}
                    aria-hidden
                  >
                    <span
                      className={cx(
                        "h-2.5 w-2.5 rounded-full transition",
                        active
                          ? "bg-orange-400 shadow-[0_0_14px_rgba(255,140,0,0.65)]"
                          : "bg-zinc-200 group-hover:bg-white"
                      )}
                    />
                  </span>

                  <span className="truncate">{item.label}</span>
                </span>

                {item.badge ? (
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-orange-200 ring-1 ring-inset ring-orange-500/25">
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cx(base, inactive)}
                onClick={() => setOpenMobile(false)}
              >
                {leftGlow}
                {content}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cx(base, active ? activeCls : inactive)}
                onClick={() => setOpenMobile(false)}
              >
                {leftGlow}
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5">
        <div className="rounded-2xl border border-white/15 bg-zinc-950/60 p-4">
          <div className="text-xs font-semibold text-white">Dica</div>
          <div className="mt-1 text-xs text-zinc-200">
            Aquece no <span className="text-orange-300">Retake</span> enquanto a fila fecha.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/15 bg-zinc-950/85 px-4 py-3 backdrop-blur md:hidden">
        <div className="text-sm font-semibold text-white">AKtéia</div>
        <button
          onClick={() => setOpenMobile(true)}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          Menu
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 border-r border-white/15 bg-[#111111] backdrop-blur md:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {openMobile ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpenMobile(false)} />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] border-r border-white/15 bg-zinc-950/95 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
              <div className="text-sm font-semibold text-white">Menu</div>
              <button
                onClick={() => setOpenMobile(false)}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                Fechar
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      ) : null}
    </>
  );
}