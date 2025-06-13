import crypto from "crypto";
import sha256 from "crypto-js/sha256.js";

function encrypt(item: string, key: string): string {
  // Define the encryption algorithm (ECB mode)
  const algorithm = 'aes-256-ecb';

  // Generate a key using scrypt
  const derivedKey = crypto.scryptSync(key, "GfG", 32); // 32 bytes for aes-256

  // Create a cipher without an IV
  const cipher = crypto.createCipheriv(algorithm, derivedKey, null);

  // Encrypt the data
  let encrypted = cipher.update(item, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}

function decrypt(encrypted: string, key: string): string {
  // Define the decryption algorithm (ECB mode)
  const algorithm = 'aes-256-ecb';

  // Generate the key using scrypt
  const derivedKey = crypto.scryptSync(key, "GfG", 32); // 32 bytes for aes-256

  // Create a decipher without an IV
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, null);

  // Decrypt the data
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Generate a hash for a wallet key
function walletHashKey(userId: string): {
  hashId: string;
  walletIdLock: string;
} {
  // Generate hashId by encrypting userId and taking a substring
  let hashId = sha256(encrypt(userId, userId.toString().substring(0, 5)))
      .toString()
      .substring(0, 16);

  // Generate walletIdLock by encrypting SHA-256 hash of userId and taking a substring
  let walletIdLock = encrypt(
      sha256(userId).toString(),
      process.env.WALLET_ID_ENCODE_KEY || ""
  )
      .toString()
      .substring(0, 16);

  return {
    hashId,
    walletIdLock,
  };
}

// Generate a SHA-256 hash for data
function hash256(data: any): string {
  return sha256(JSON.stringify(data)).toString();
}

export { encrypt, decrypt, walletHashKey, hash256 };
