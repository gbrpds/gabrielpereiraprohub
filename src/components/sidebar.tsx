"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/demandas", label: "Demandas" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/financeiro", label: "Financeiro" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-56 flex-col justify-between border-r border-neutral-800 bg-black px-4 py-6">
      <div>
        <p className="mb-8 px-2 text-lg font-semibold uppercase tracking-wide text-white">
          Hub
        </p>
        <nav className="space-y-1">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-orange-500 text-black"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-2 text-left text-sm font-medium text-neutral-500 hover:bg-neutral-900 hover:text-white"
      >
        Sair
      </button>
    </aside>
  );
}
