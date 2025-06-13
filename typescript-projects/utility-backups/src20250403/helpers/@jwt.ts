// jwt.ts
import jwt from "jsonwebtoken";
import "dotenv/config";
import { decrypt, encrypt, hash256 } from "./@encrypt";
import { logger } from "./@logger";

export interface encodeJWT {
  sub: string;
  secrets?: string;
  exp?: number;
  extra?: any;
}


class JWT {
  // Encode a JWT token
  static encode({ sub, secrets, exp = 5, extra }: encodeJWT, key: string): string {

    if (!key) throw new Error("jwt key not defined");

    if (!sub) throw new Error("invalid token id");

    // Encrypt the key value
    const JWTkey = encrypt(key, key);

    // Create payload for the JWT token
    let payload = {
      iat: Math.floor(Date.now() / 1000), // issued at
      sub, // service ID
      exp: Math.floor((Date.now() + 1000 * (exp * 60)) / 1000), // expired time in min 0-60
      extra,
      secrets
    };

    // If secrets provided, encrypt and add to payload
    if (secrets) payload.secrets = encrypt(secrets, key); // the userID

    // Sign the JWT token using the key
    return jwt.sign(payload, JWTkey);
  }

  // Decode a JWT token
  static decode(token: string, key: string): encodeJWT | boolean {

    if (!key) throw new Error("jwt key not defined");

    // Encrypt the key value
    const JWTkey = encrypt(key, key);

    try {
      // Verify the JWT token using the key
      const decoded = jwt.verify(token, JWTkey);
      const data = { ...decoded as encodeJWT };

      // if secrets exist, decrypt and add to data
      if ("secrets" in data) data.secrets = decrypt(data.secrets as string, key);
      return data;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default JWT;
