import validatePubSub from "./body/validatePubSub";
import validateStatusBody from "./body/validateStatusBody";
import validatePlan from "./locals/validatePlan";
import validateTxPath from "./locals/validateTxPath";
import verifyIsNewPayment from "./locals/verifyIsNewPayment";

const processAirtimeMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processInternetMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processPrepaidMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processPostpaidMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processBetMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processCableTvMD = [
  validatePubSub,
  validateTxPath,
  validatePlan,
  verifyIsNewPayment,
  // verifyJwt,
];
const processStatusMD = [
  validateStatusBody,
  validateTxPath,
  // verifyCoreIdToken,
];

export {
  processBetMD,
  processCableTvMD,
  processPrepaidMD,
  processPostpaidMD,
  processAirtimeMD,
  processInternetMD,
  processStatusMD,
};
