import type { Metadata } from "next";
import { AppProviders } from "./providers";
import { BottomNav } from "@/widgets/bottom-nav";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
