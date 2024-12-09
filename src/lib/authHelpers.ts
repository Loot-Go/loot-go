import jwt, { JwtHeader, JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";

export const getKey = (
  headers: JwtHeader,
  callback: (err: Error | null, key?: Secret) => void,
): void => {
  // Define the options for the fetch request
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
    },
  };

  // Perform the fetch request asynchronously
  fetch(
    `https://app.dynamicauth.com/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/keys`,
    options,
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const publicKey = json.key.publicKey;
      const pemPublicKey = Buffer.from(publicKey, "base64").toString("ascii");
      callback(null, pemPublicKey); // Pass the public key to the callback
    })
    .catch((err) => {
      console.error(err);
      callback(err); // Pass the error to the callback
    });
};

export const validateJWT = async (
  token: string,
): Promise<JwtPayload | null> => {
  try {
    const decodedToken: JwtPayload = await new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        { algorithms: ["RS256"] },
        (
          err: VerifyErrors | null,
          decoded: string | JwtPayload | undefined,
        ) => {
          if (err) {
            reject(err);
          } else {
            // Ensure that the decoded token is of type JwtPayload
            if (typeof decoded === "object" && decoded !== null) {
              resolve(decoded);
            } else {
              reject(new Error("Invalid token"));
            }
          }
        },
      );
    });

    return decodedToken;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
