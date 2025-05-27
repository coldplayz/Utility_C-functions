import { createHmac } from "crypto";

const apiKey = process.env.GB_API_KEY!;
const encryptionKey = process.env.GB_ENCRYPTION_KEY!;

// TODO:
// - requery:
//   - status 200 && success 0 === invalid api key
//   - status 404  === order ID not found? (tried with empty string)
// - pay:
//   - status 200 && success 0 === invalid api key
//   - status 200 && success [false, 0] === invalid header
//   - status 200 && success false === incomplete request data
// - all:
//   - SEEMS status 200 && success [false, 0] indicates a failed tx, suggesting that the `success` property is best indicator of a failed tx

/** Generate request ID (reference number) for transaction */
export function generateRequestId() {
  const currDate = new Date();
  const datePart = currDate
    .toISOString() // e.g. 2025-04-09T17:29:20.963Z
    .substring(0, 16) // 2025-04-09T17:29
    .replace(/[-T:]/g, ""); // 202504091729
  const refPart = `coll1xxxdoc1xxxcoll2xxxdoc${currDate.getSeconds()}`;

  const requestId = `${datePart}${refPart}`;
  // const requestId = `${datePart}${currDate.getSeconds()}otherAlphanumericCharacters`;

  return requestId;
}

/** Get bet merchants */
export async function getBetProviders(_requestId = generateRequestId()) {
  // console.log(requestId, apiKey); // TODO: remove
  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    MerchantId: "coldplayz",
    "Content-Type": "application/json",
  };

  // const body = JSON.stringify({
  //   product: "mtn",
  // });

  const resp = await fetch(`https://sandbox.giftbills.com/api/v1/betting`, {
    method: "GET",
    headers,
    mode: "cors",
    // body,
  });

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Fetch wallet balance */
export async function getBalance() {
  // console.log(requestId, apiKey); // TODO: remove

  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    MerchantId: "coldplayz",
    "Content-Type": "application/json",
  };

  const resp = await fetch(
    `https://sandbox.giftbills.com/api/v1/check-balance`,
    {
      method: "POST",
      headers,
      mode: "cors",
    }
  );

  console.log(resp.ok, resp.status);
  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Fund bet account */
export async function payBet(requestId = generateRequestId()) {
  // console.log(requestId, apiKey); // TODO: remove

  const body = JSON.stringify({
    provider: "BET9JA",
    customerId: "1028707",
    amount: "200",
    reference: requestId,
  });

  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    MerchantId: "coldplayz",
    "Content-Type": "application/json",
    Encryption: getHmacOf(JSON.parse(body)),
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

  console.log(resp.ok, resp.status);
  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Check tx status */
export async function checkStatus(orderNumber: string) {
  // console.log(requestId, apiKey); // TODO: remove

  // const body = JSON.stringify({
  //   provider: "BET9JA",
  //   customerId: "1028707",
  //   amount: "200",
  //   reference: requestId,
  // });

  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    MerchantId: "coldplayz",
    "Content-Type": "application/json",
    // Encryption: getHmacOf(JSON.parse(body)),
  };

  const resp = await fetch(
    `https://sandbox.giftbills.com/api/v1/bill/status/${orderNumber}`,
    {
      method: "GET",
      headers,
      mode: "cors",
      // body,
    }
  );

  console.log(resp.ok, resp.status);
  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
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

getBalance().then(console.log);
// checkStatus("REF_2025051520231450851241").then(console.log);
// pay().then(console.log); REF_2025051520231450851241
