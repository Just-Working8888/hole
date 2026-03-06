"use client";

import { Provider } from "react-redux";
import { store } from "@/shared/store";
import type { PropsWithChildren } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  const [manifestUrl, setManifestUrl] = useState("");

  useEffect(() => {
    setManifestUrl(`${window.location.origin}/tonconnect-manifest.json`);
  }, []);

  if (!manifestUrl) return null;

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/hole_support_bot/app' // Add your t.me bot URL if available
      }}
      // @ts-ignore
      uiPreferences={{ theme: 'DARK' }}
      uiOptions={{
        // @ts-ignore
        analytics: { mode: 'off' } // Turn off tonconnect analytics to prevent 400
      }}
    >
      <Provider store={store}>{children}</Provider>
    </TonConnectUIProvider>
  );
}
