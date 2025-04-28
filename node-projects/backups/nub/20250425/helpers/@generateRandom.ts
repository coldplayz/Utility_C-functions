import crypto from "crypto";

export function generateRandomHex(length: number) {
  return crypto.randomBytes(length / 2).toString("hex");
}

export const generateRandomIntRange = (min = 100, max = 1_000_000) =>
  crypto.randomInt(min, max);

// // Example: generate a random hex string of length 16
// const randomHex = generateRandomHex(16);
// console.log(randomHex); // Output: a 16-character random hex string, e.g., "a3b7c9e1f2d4a6b8"
