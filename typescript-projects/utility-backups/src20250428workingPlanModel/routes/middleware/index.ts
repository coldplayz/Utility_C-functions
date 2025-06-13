import validatePubSub from "./body/validatePubSub";
import validatePlan from "./locals/validatePlan";
import validateTxPath from "./locals/validateTxPath";
import verifyFirstPaymentRequest from "./locals/verifyFirstPaymentRequest";
import validateStatusQuery from "./query/validateStatusQuery";

const processMobileMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processElectricityMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processBetMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyFirstPaymentRequest,
  // verifyJwt,
];
const processCableTvMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
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
