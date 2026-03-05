import type { Metadata } from "next";
import { AppProviders } from "./providers";
import { BottomNav } from "@/widgets/bottom-nav";
import "./globals.scss";

export const metadata: Metadata = {
  title: "HOL",
  description: "HOL platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AppProviders>
          {children}
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
