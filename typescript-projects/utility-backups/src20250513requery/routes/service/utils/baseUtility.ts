// import { idToProviderMap } from "../../../constants";
// import ErrorHandler from "../../../errors/errManager";
// import ObjectValidator from "../../../helpers/@objectValidator";
// import {
//   DeepRequired,
//   Flatten,
//   ProviderId,
//   TProcessData,
//   UtilityProduct,
// } from "../../../interface/types";

// export default class BaseUtility {
//   /**
//    * Gets the class instance containing provider-specific logic based on the provided ID.
//    * @param providerId - the identifier for a specific utility provider. E.g. paga.
//    * @returns the class instance for the specified utility provider.
//    */
//   static getProviderById(providerId: ProviderId) {
//     const provider = idToProviderMap[providerId];
//     if (!provider)
//       throw new ErrorHandler(
//         `No provider logic matching the ID: ${providerId}`,
//         true
//       );

//     return provider;
//   }

//   static validateProcessData(data: TProcessData) {
//     const processDataValidator = new ObjectValidator(processDataRule);

//     if (!processDataValidator.validate(data))
//       throw new ErrorHandler("Error validating utility process data", true, {
//         reason: processDataValidator.response,
//         invalidData: data,
//         source: this.validateProcessData.name,
//       });
//   }
// }

// const processDataRule = {
//   uid: "required",
//   appTxHash: "required",
//   nairaAdminDocPath: "required",
//   provider: "required",
//   txPath: "required",
//   "paymentData.customerId": "required|string",
//   "paymentData.merchantId": "required|isUtilityMerchantId",
//   "paymentData.productId": "required|isUtilityProductId",
//   "paymentData.amount": `required|isNumber`,
//   "paymentData.providerId": "required",
//   "paymentData.planCode": "string",
//   "paymentData.type": "isPlanType",
//   "paymentData.planId": "string",
// } satisfies { [k in keyof Flatten<DeepRequired<TProcessData>>]?: string };
