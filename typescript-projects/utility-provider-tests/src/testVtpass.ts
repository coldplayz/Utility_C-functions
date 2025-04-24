const publicKey = process.env.VTP_PUBLIC_KEY!;
const secretKey = process.env.VTP_SECRET_KEY!;
const apiKey = process.env.VTP_API_KEY!;

/** Generate request ID (reference number) for transaction */
export function generateRequestId() {
  const currDate = new Date();
  const datePart = currDate
    .toISOString() // e.g. 2025-04-09T17:29:20.963Z
    .substring(0, 16) // 2025-04-09T17:29
    .replace(/[-T:]/g, ""); // 202504091729
  const refPart = `coll1---doc1---coll2---doc${currDate.getSeconds()}`;

  const requestId = `${datePart}---${refPart}`;
  // const requestId = `${datePart}${currDate.getSeconds()}otherAlphanumericCharacters`;

  return requestId;
}

/** Get merchant categories */
export async function getCategories() {
  const headers: HeadersInit = {
    "api-key": apiKey,
    "public-key": publicKey,
  };

  // const body = JSON.stringify({});

  const resp = await fetch(
    "https://sandbox.vtpass.com/api/service-categories",
    {
      headers,
      mode: "cors",
    }
  );

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Get merchants */
export async function getCategoryServices() {
  const headers: HeadersInit = {
    "api-key": apiKey,
    "public-key": publicKey,
  };

  // const body = JSON.stringify({});

  const resp = await fetch(
    "https://sandbox.vtpass.com/api/services?identifier=other-services",
    {
      headers,
      mode: "cors",
    }
  );

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Get merchant service types/codes */
export async function getVariationCodes() {
  const headers: HeadersInit = {
    "api-key": apiKey,
    "public-key": publicKey,
  };

  // const body = JSON.stringify({});

  const resp = await fetch(
    "https://sandbox.vtpass.com/api/service-variations?serviceID=mtn",
    {
      headers,
      mode: "cors",
    }
  );

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Get wallet balance */
export async function getWalletBalance() {
  const headers: HeadersInit = {
    "api-key": apiKey,
    "public-key": publicKey,
  };

  // const body = JSON.stringify({});

  const resp = await fetch("https://sandbox.vtpass.com/api/balance", {
    headers,
    mode: "cors",
  });

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Get transaction status */
export async function getTxStatus(requestId = generateRequestId()) {
  const headers: HeadersInit = {
    "api-key": apiKey,
    // "public-key": publicKey,
    "secret-key": secretKey,
  };

  // const body = JSON.stringify({ request_id: requestId });

  const resp = await fetch(
    `https://sandbox.vtpass.com/api/requery?request_id=${requestId}`,
    {
      method: "POST",
      headers,
      mode: "cors",
      // body,
    }
  );

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

/** Get transaction status */
export async function pay(requestId = generateRequestId()) {
  const headers: HeadersInit = {
    "api-key": apiKey,
    // "public-key": publicKey,
    "secret-key": secretKey,
  };

  const body = JSON.stringify({
    // request_id: requestId,
    // serviceID: "mtn-data",
    // billersCode: "08011111111",
    // variation_code: "mtn-10mb-100",
    // phone: "08011111111",
  });

  const resp = await fetch(
    `https://sandbox.vtpass.com/api/pay?request_id=${requestId}&phone=08011111111&serviceID=mtn-data&variation_code=mtn-10mb-100`,
    {
      method: "POST",
      headers,
      mode: "cors",
      body,
    }
  );

  const data = resp.ok ? await resp.json() : await resp.text();

  return JSON.stringify(data);
}

getCategoryServices().then(console.log);
// getTxStatus("20250409194044coll1---doc1---coll2---doc2").then(console.log);
// pay().then(console.log);
