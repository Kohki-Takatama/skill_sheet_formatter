import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skill Sheet Formatter PoC",
  description: "Skill sheet formatter PoC"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-muted/30">
            <Sidebar />
            <main className="flex-1 p-8">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
