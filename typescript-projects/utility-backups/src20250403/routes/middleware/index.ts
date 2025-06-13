import { filterCors } from "./header/filterCors";

const processBillMD = [
  filterCors, // TODO: remove
  // verifyJwt,
];
const approveBillMD = [
  filterCors, // TODO: remove
  // verifyCoreIdToken,
];
const reverseBillMD = [
  filterCors, // TODO: remove
  // verifyCoreIdToken,
];

export { processBillMD, approveBillMD, reverseBillMD };
