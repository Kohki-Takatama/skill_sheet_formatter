"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile", label: "プロフィール" },
  { href: "/projects", label: "案件履歴" },
  { href: "/output", label: "出力センター" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background p-6">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">SkillSheet</p>
        <h1 className="text-xl font-semibold">Formatter PoC</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-muted",
              pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
