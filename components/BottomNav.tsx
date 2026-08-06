"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChart,
  IconFoosball,
  IconHandshake,
  IconHistory,
  IconTrophy,
} from "@/components/icons";

const ITEMS = [
  { href: "/", label: "Gioca", Icon: IconFoosball },
  { href: "/classifica", label: "Classifica", Icon: IconTrophy },
  { href: "/coppie", label: "Coppie", Icon: IconHandshake },
  { href: "/storico", label: "Storico", Icon: IconHistory },
  { href: "/analisi", label: "Analisi", Icon: IconChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-felt-line/40 bg-felt-panel/95 backdrop-blur supports-[backdrop-filter]:bg-felt-panel/80">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-mono uppercase tracking-tight transition-colors duration-[var(--dur-fast)] ${
                active ? "text-amber" : "text-bone-dim hover:text-bone"
              }`}
            >
              <item.Icon className="size-5" />
              {item.label}
              {active && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-amber" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
