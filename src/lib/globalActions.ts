"use server";

import jwt from "jsonwebtoken";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

const mapsTokenCache = unstable_cache(
  async (teamId: string, keyId: string, privateKey: string, domain: string) => {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 15778800; // 6 months
    const payload = {
      iss: teamId,
      iat: now,
      exp: exp,
      origin: process.env.NODE_ENV === "development" ? "*" : domain,
    };
    const token = jwt.sign(payload, privateKey, {
      algorithm: "ES256",
      keyid: keyId,
    });
    return token;
  },
  ["maps-token-cache"],
  {
    revalidate: 15778000,
  },
);

export async function getMapsToken() {
  const teamId = process.env.APPLE_MAPS_TEAM_ID;
  const mapsKeyId = process.env.APPLE_MAPS_KEY_ID;
  const privateKey = process.env.APPLE_MAPS_PRIVATE_KEY;

  const headersList = headers();
  const host = headersList.get("Host") ?? "";

  if (!teamId || !mapsKeyId || !privateKey)
    throw new Error("Missing Apple Maps credentials");

  const token = await mapsTokenCache(teamId, mapsKeyId, privateKey, host);

  return token;
}
