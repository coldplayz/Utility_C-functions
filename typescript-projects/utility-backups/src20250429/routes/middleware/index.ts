import validatePubSub from "./body/validatePubSub";
import validatePlan from "./locals/validatePlan";
import validateTxPath from "./locals/validateTxPath";
import verifyIsNewPayment from "./locals/verifyIsNewPayment";
import validateStatusQuery from "./query/validateStatusQuery";

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
  validateStatusQuery,
  // validateTxPath, // TODO: would need to remove; txPath to be validated in service
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
