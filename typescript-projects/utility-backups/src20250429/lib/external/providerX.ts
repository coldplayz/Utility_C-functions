// import ErrorHandler from "../../errors/errManager";
// import { logger } from "../../helpers/@logger";
// import selectRandom from "../../helpers/@selectRandom";
// import {
//   AppTxStatus,
//   IUtilityProvider,
//   ProviderId,
//   ProviderTxStatus,
//   TPaymentData,
//   TStatusData,
// } from "../../interface/types";

// export class ProviderX implements IUtilityProvider {
//   id = ProviderId.ProviderX;

//   constructor() {}

//   async airtime(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async internet(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async cableTv(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async bet(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async postpaid(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async prepaid(_: TPaymentData, txPath: string) {
//     // TODO: implementation

//     return {
//       initialStatus: selectRandom(Object.values(ProviderTxStatus)),
//       statusUpdateMethods: {
//         isWebhook: selectRandom([true, false]),
//         isRequery: selectRandom([true, false]),
//       },
//       txRef: this.txpathToTxref(txPath),
//     };
//   }

//   async checkStatus(
//     statusData: TStatusData,
//     _reqBody: Record<string, unknown>
//   ) {
//     // TODO: implementation
//     // TODO: if reqBody is webhook data, validate

//     const ref = statusData.reference;
//     if (!ref)
//       throw new ErrorHandler("Request reference is missing", false, {
//         source: this.checkStatus.name,
//       });

//     return {
//       status: selectRandom(Object.values(AppTxStatus)),
//       txPath: this.txrefToTxpath(ref),
//     };
//   }

//   txpathToTxref(txPath: string) {
//     // TODO: implementation
//     logger.error(`Not yet implemented`, {
//       class: this.constructor.name,
//       method: this.txpathToTxref.name,
//     });
//     return txPath.replace(/\//g, "---");
//   }

//   txrefToTxpath(txRef: string) {
//     // TODO: implementation
//     logger.error(`Not yet implemented`, {
//       class: this.constructor.name,
//       method: this.txrefToTxpath.name,
//     });
//     return txRef.replace(/---/g, "/");
//   }
// }

// // type WebhookData = { [K: string]: unknown };
// // const webhookDataValidatorRule: {
// //   [k in keyof WebhookData]: string;
// // } = {}; // TODO: actual data validation
// // const webhookDataValidator = new ObjectValidator(webhookDataValidatorRule);

// const providerX = new ProviderX();
// Object.freeze(providerX);
// export default providerX;
