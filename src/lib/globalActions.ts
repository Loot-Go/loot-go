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

export async function getNearbyRoadCoordinates(coordinates: {
  lat: number;
  lng: number;
}) {
  const url = "https://overpass-api.de/api/interpreter";
  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      data: `(  way  (around:500,${coordinates.lat}, ${coordinates.lng})  [highway~"^(primary|secondary|tertiary|residential|pedestrian)$"];>;);out;`,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.text();

    const pattern1 = /<node.+\/>/g;
    const pattern2 = /<node.*lat="(.+)".*lon="(.+)"\/>/;
    const match1 = data.match(pattern1);

    if (!match1) return [];

    const randomMatches = match1
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(10, match1.length - 1));

    const coordinates: {
      lat: number;
      lng: number;
    }[] = [];

    randomMatches.forEach((str) => {
      try {
        const match2 = str.match(pattern2);
        if (match2) {
          coordinates.push({
            lat: parseFloat(match2[1]),
            lng: parseFloat(match2[2]),
          });
        }
      } catch {}
    });

    return coordinates;
  } catch (error) {
    console.error(error);
  }
}
