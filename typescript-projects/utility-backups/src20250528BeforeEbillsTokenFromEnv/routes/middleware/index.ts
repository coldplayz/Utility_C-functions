import validateAirtimePaymentData from "./locals/validateAirtimePaymentData";
import validateBetPaymentData from "./locals/validateBetPaymentData";
import validateCableTvPaymentData from "./locals/validateCableTvPaymentData";
import validateInternetPaymentData from "./locals/validateInternetPaymentData";
import validatePubSub from "./body/validatePubSub";
import validateTxPath from "./locals/validateTxPath";
import verifyIsNewPayment from "./locals/verifyIsNewPayment";
import validateElectricityPaymentData from "./locals/validateElectricityPaymentData";
import validateStatusBody from "./body/validateStatusBody";
import validateUtilityMeta from "./locals/validateUtilityMeta";

const processAirtimeMD = [
  validatePubSub,
  validateTxPath,
  validateAirtimePaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processInternetMD = [
  validatePubSub,
  validateTxPath,
  validateInternetPaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processPrepaidMD = [
  validatePubSub,
  validateTxPath,
  validateElectricityPaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processPostpaidMD = [
  validatePubSub,
  validateTxPath,
  validateElectricityPaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processBetMD = [
  validatePubSub,
  validateTxPath,
  validateBetPaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processCableTvMD = [
  validatePubSub,
  validateTxPath,
  validateCableTvPaymentData,
  verifyIsNewPayment,
  // verifyJwt,
];
const processStatusMD = [
  validateStatusBody,
  validateTxPath,
  validateUtilityMeta,
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
