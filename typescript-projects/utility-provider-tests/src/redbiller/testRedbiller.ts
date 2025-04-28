const privateKey = process.env.RDB_PRIVATE_KEY!;

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

/** Buy mobile airtime */
export async function payAirtime(requestId = generateRequestId()) {
  console.log(requestId); // TODO: remove
  const headers: HeadersInit = {
    "Private-Key": privateKey,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    product: "MTN",
    // phone_no: "08131533096",
    phone_no: "08103665556",
    amount: 20_000, // min: 100, max: 20,000
    ported: "false",
    // callback_url: "https://domain.com",
    reference: requestId,
  });

  const resp = await fetch(
    `https://api.test.redbiller.com/1.0/bills/airtime/purchase/create`,
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

/** Get mobile airtime data plans */
export async function getAirtimeData(requestId = generateRequestId()) {
  console.log(requestId); // TODO: remove
  const headers: HeadersInit = {
    "Private-Key": privateKey,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    product: "mtn",
  });

  const resp = await fetch(
    `https://api.test.redbiller.com/1.0/bills/data/plans/list`,
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

/** Buy mobile airtime data */
export async function payAirtimeData(requestId = generateRequestId()) {
  console.log(requestId); // TODO: remove
  const headers: HeadersInit = {
    "Private-Key": privateKey,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    product: "mtn",
    phone_no: "08103665556",
    code: "3009",
    ported: "false",
    // callback_url: "https://domain.com",
    reference: requestId,
  });

  const resp = await fetch(
    `https://api.test.redbiller.com/1.0/bills/data/plans/purchase/create`,
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

/** Buy mobile airtime pin */
export async function payAirtimePin(requestId = generateRequestId()) {
  console.log(requestId); // TODO: remove
  const headers: HeadersInit = {
    "Private-Key": privateKey,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    product: "Airtel",
    // phone_no: "08131533096",
    // phone_no: "08103665556",
    amount: 10, // min: 100, max: 5,000
    quantity: 10, // min: 10, max: tested up to 500k
    ported: "false",
    // callback_url: "https://domain.com",
    reference: requestId,
  });

  const resp = await fetch(
    `https://api.test.redbiller.com/1.3/bills/airtime-pin/purchase/create`,
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

/** Get airtime transaction status */
export async function getTxStatus(requestId: string) {
  console.log(requestId); // TODO: remove
  const headers: HeadersInit = {
    "Private-Key": privateKey,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    // product: "MTN",
    // phone_no: "08131533096",
    // phone_no: "08103665556",
    // amount: 20_000, // min: 100, max: 20,000
    // ported: "false",
    // callback_url: "https://domain.com",
    reference: requestId,
  });

  const resp = await fetch(
    `https://api.test.redbiller.com/1.0/bills/airtime/purchase/status`,
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

payAirtimeData().then(console.log);
// getTxStatus("1").then(console.log);
// pay().then(console.log);
