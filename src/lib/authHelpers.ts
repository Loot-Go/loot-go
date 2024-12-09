import { JWTPayload, jwtVerify, KeyLike } from "jose";

const getKey = async () => {
  try {
    const data = await fetch(
      `https://app.dynamic.xyz/api/v0/sdk/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`,
    ).then((res) => res.json());

    const keys = data.keys as KeyLike[] | undefined;

    if (keys) return keys[0];
    else throw new Error("No keys found");
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching public key");
  }
};

export const validateJWT = async (
  token: string,
): Promise<JWTPayload | null> => {
  try {
    const JWKKey = await getKey();

    const { payload } = await jwtVerify(token, JWKKey);

    return payload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
