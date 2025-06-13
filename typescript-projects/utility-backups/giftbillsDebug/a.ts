import { createHmac } from "crypto";

const apiKey = process.env.GB_API_KEY!;
const encryptionKey = process.env.GB_ENCRYPTION_KEY!;

async function bet() {
  // appOrderId: string // merchantId: string, // amount: number, // accountId: string,
  try {
    // const body = JSON.stringify({
    //   amount,
    //   customerId: accountId,
    //   provider: merchantId,
    //   reference: appOrderId,
    // });

    const body = JSON.stringify({
      provider: "BET9JA",
      customerId: "1028707",
      amount: "200",
      reference: "hashbet1",
    });

    const headers: HeadersInit = {
      Authorization: `Bearer ${apiKey}`,
      MerchantId: "coldplayz",
      "Content-Type": "application/json",
      Encryption: getHmacOf(JSON.parse(body)),
      // Encryption: "0127e1ad679441cf26fc850504478b19e7b12f661c2367ee228017a1510dd569a4a3964b6d08e8ddff054f907b93849a3290e4fec1e8f1ecfb2ef78c8cc96822",
    };

    const resp = await fetch(
      `https://sandbox.giftbills.com/api/v1/betting/topup`,
      {
        method: "POST",
        headers,
        mode: "cors",
        body,
      }
    );

    const data = await resp.json();

    if (!data.success) {
      console.log({ error: data });
    }

    console.log(data);
  } catch (error) {
    // Some other error; likely after request was made. E.g. validation error
    console.log({ error });
  }
}

export function getHmacOf(data: Record<string, unknown>) {
  // const sortedMap = data;
  const sortedMap = sortMapAsc(data);
  const hmac = createHmac("sha512", encryptionKey);

  return hmac.update(JSON.stringify(sortedMap)).digest("hex");
}

export const sortMapAsc = (map: Record<string, unknown>) => {
  return Object.entries(map)
    .sort(([k], [k2]) => (k < k2 ? -1 : k > k2 ? 1 : 0))
    .reduce((prev, [k, v]) => {
      prev[k] = v;
      return prev;
    }, {} as Record<string, unknown>);
};

console.log(bet()); // TODO: remove
