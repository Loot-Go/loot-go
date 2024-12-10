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
      data: `(  way  (around:1000,${coordinates.lat}, ${coordinates.lng})  [highway~"^(primary|secondary|tertiary|residential|pedestrian)$"];>;);out;`,
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.text();

    const pattern1 = /<node.+\/>/g;
    const pattern2 = /<node.*lat="(.+)".*lon="(.+)"\/>/;
    const match1 = data.match(pattern1);

    const coordinates: {
      lat: number;
      lng: number;
    }[] = [];

    if (match1) {
      match1.forEach((str) => {
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
    }

    // select 10 random coordinates from the array
    const randomCoordinates = coordinates
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(20, coordinates.length - 1));

    return randomCoordinates;
  } catch (error) {
    console.error(error);
  }
}
