const publicKey = process.env.VTP_PUBLIC_KEY!;
const secretKey = process.env.VTP_SECRET_KEY!;
const apiKey = process.env.VTP_API_KEY!;

/** Get merchant categories */
async function getCategories() {
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
  )

 const data = resp.ok ? await resp.json() : await resp.text();

 return JSON.stringify(data);
}

/** Get merchants */
async function getCategoryServices() {
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
  )

 const data = resp.ok ? await resp.json() : await resp.text();

 return JSON.stringify(data);
}

/** Get merchant service types/codes */
async function getVariationCode() {
  const headers: HeadersInit = {
    "api-key": apiKey,
    "public-key": publicKey,
  };

  // const body = JSON.stringify({});
  
  const resp = await fetch(
    "https://sandbox.vtpass.com/api/service-variations?serviceID=mtn-data",
    {
      headers,
      mode: "cors",
    }
  )

 const data = resp.ok ? await resp.json() : await resp.text();

 return JSON.stringify(data);
}

getVariationCode().then(console.log);
