"use client";

import { Button } from "@/components/ui/button";
import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sdkHasLoaded, user, handleLogOut } = useDynamicContext();
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const redirectTo = searchParams.get("redirectTo");

      if (redirectTo) {
        router.replace(redirectTo);
      }
    }
  }, [status, searchParams, router]);

  const signOutFn = async () => {
    await handleLogOut();
    signOut();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-28 bg-[#121212] text-white">
      <h1 className="text-center text-3xl font-bold">
        Turn your daily life
        <br /> into treasure hunt
      </h1>

      <div className="sr-only">
        <DynamicConnectButton>
          <div ref={btnRef}></div>
        </DynamicConnectButton>
      </div>

      <Button
        style={{
          background: "linear-gradient(180deg, #D5FC44 0%, #A9D600 100%)",
        }}
        size={"icon"}
        className="relative h-auto w-3/4 overflow-hidden rounded-full py-3 text-2xl font-bold text-black"
        disabled={!sdkHasLoaded || loading}
        onClick={() => {
          if (!user) {
            setLoading(true);
            btnRef.current?.click();
          } else {
            signOutFn();
          }
        }}
      >
        {!user ? "Sign up" : "Sign out"}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <ImSpinner2 className="animate-spin" size={30} />
          </div>
        )}
      </Button>
    </div>
  );
}
