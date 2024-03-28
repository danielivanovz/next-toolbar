import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToolbarProvider } from "@/context/toolbar-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextJS Toolbar",
  description: "A DX-focused toolbar for Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToolbarProvider>{children}</ToolbarProvider>
      </body>
    </html>
  );
}
