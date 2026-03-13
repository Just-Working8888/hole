"use client";

import { Provider } from "react-redux";
import { store } from "@/shared/store";
import type { PropsWithChildren } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// Используем env переменную — работает и локально, и на продакшене.
// Локальный localhost недоступен мобильным кошелькам, поэтому всегда
// указываем на задеплоенный манифест.
const MANIFEST_URL =
    process.env.NEXT_PUBLIC_MANIFEST_URL ??
    "https://hole-nu.vercel.app/tonconnect-manifest.json";

export function AppProviders({ children }: PropsWithChildren) {
    return (
        <TonConnectUIProvider
            manifestUrl={MANIFEST_URL}
            actionsConfiguration={{
                twaReturnUrl: "https://hole-nu.vercel.app",
            }}
        >
            <Provider store={store}>{children}</Provider>
        </TonConnectUIProvider>
    );
}
