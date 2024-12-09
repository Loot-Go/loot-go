"use client";

import { DynamicContextProvider, getAuthToken } from "@/lib/dynamic";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCsrfToken, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function DynamicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <SessionProvider>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
          walletConnectors: [EthereumWalletConnectors, FlowWalletConnectors],
          events: {
            onAuthSuccess: async () => {
              const authToken = getAuthToken();

              if (!authToken) return;

              const csrfToken = await getCsrfToken();

              fetch("/api/auth/callback/credentials", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `csrfToken=${encodeURIComponent(
                  csrfToken,
                )}&token=${encodeURIComponent(authToken)}`,
              })
                .then((res) => {
                  if (res.ok) {
                    console.log("LOGGED IN", res);

                    const searchParams = new URLSearchParams(
                      window.location.search,
                    );

                    const redirectTo = searchParams.get("redirectTo");
                    if (redirectTo) router.push(redirectTo);
                    else router.push("/");
                  } else {
                    // Handle any errors - maybe show an error message to the user
                    console.error("Failed to log in");
                  }
                })
                .catch((error) => {
                  // Handle any exceptions
                  console.error("Error logging in", error);
                });
            },
          },
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </SessionProvider>
  );
}
