import validatePubSub from "./body/validatePubSub";
import validateTxPath from "./locals/validateTxPath";
import verifyFirstPaymentRequest from "./locals/verifyFirstPaymentRequest";
import validateStatusQuery from "./query/validateStatusQuery";

const processMobileMD = [
  validatePubSub,
  validateTxPath,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processElectricityMD = [
  validatePubSub,
  validateTxPath,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processBetMD = [
  validatePubSub,
  validateTxPath,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processCableTvMD = [
  validatePubSub,
  validateTxPath,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processStatusMD = [
  validateStatusQuery,
  // validateTxPath, // TODO: would need to remove; txPath to be validated in service
  // verifyCoreIdToken,
];

export {
  processBetMD,
  processCableTvMD,
  processElectricityMD,
  processMobileMD,
  processStatusMD,
};
