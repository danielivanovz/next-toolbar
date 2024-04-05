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
        <footer className="absolute bottom-0 right-0 left-0 flex justify-center items-center py-2 font-mono text-sm">
          <p>
            made with <span className="font-sans">❤️</span> by{" "}
            <a
              href="https://www.danielivanov.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800/90"
            >
              me
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
