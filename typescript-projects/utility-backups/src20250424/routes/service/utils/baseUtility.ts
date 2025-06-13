import { idToProviderMap } from "../../../constants";
import ErrorHandler from "../../../errors/errManager";
import { logger } from "../../../helpers/@logger";
import ObjectValidator from "../../../helpers/@objectValidator";
import {
  AppTxStatus,
  DeepRequired,
  Flatten,
  ProviderId,
  TPaymentData,
  TStatusDocsWriteTxData,
  UtilityMerchantService,
} from "../../../interface/types";
import prepareUtilityTxStatusData from "../../../models/set/prepareUtilityTxStatusData";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";

export default class BaseUtility {
  static async handleFailedPayment(
    statusDocsWriteTxData: TStatusDocsWriteTxData
  ) {
    // TODO: update status to 'rejected'
    const updateData = prepareUtilityTxStatusData(AppTxStatus.Rejected);
    await updateUtilityTxStatusDocs(
      statusDocsWriteTxData.uid,
      statusDocsWriteTxData.appTxHash,
      statusDocsWriteTxData.nairaAdminDocPath,
      updateData.nairaMetadataData,
      updateData.nairaAdminData
    );
    logger.info(
      `rejected status set for uid: ${statusDocsWriteTxData.uid} and txHash: ${statusDocsWriteTxData.appTxHash}`
    );

    // TODO: initiate reversal
    console.log("reversal to be initiated...");
  }

  /**
   * Doc update logic for when we have to call provider to get status update (pullFromProvider).
   * @param statusDocsWriteTxData - data for updating status docs.
   */
  static async handleInitialPendingOrApprovedPayment(
    statusDocsWriteTxData: TStatusDocsWriteTxData
  ) {
    // TODO: update status to 'mempool'
    const updateData = prepareUtilityTxStatusData(AppTxStatus.Mempool);
    await updateUtilityTxStatusDocs(
      statusDocsWriteTxData.uid,
      statusDocsWriteTxData.appTxHash,
      statusDocsWriteTxData.nairaAdminDocPath,
      updateData.nairaMetadataData,
      updateData.nairaAdminData
    );
    logger.info(
      `mempool status set for uid: ${statusDocsWriteTxData.uid} and txHash: ${statusDocsWriteTxData.appTxHash}`
    );
  }

  /**
   * Handle confirmed approved status update (in status endpoint).
   * @param statusDocsWriteTxData - data for updating status docs.
   */
  static async handleApprovedPayment(
    statusDocsWriteTxData: TStatusDocsWriteTxData
  ) {
    // TODO: update status to 'approved'
    const updateData = prepareUtilityTxStatusData(AppTxStatus.Approved);
    await updateUtilityTxStatusDocs(
      statusDocsWriteTxData.uid,
      statusDocsWriteTxData.appTxHash,
      statusDocsWriteTxData.nairaAdminDocPath,
      updateData.nairaMetadataData,
      updateData.nairaAdminData
    );
    logger.info(
      `approved status set for uid: ${statusDocsWriteTxData.uid} and txHash: ${statusDocsWriteTxData.appTxHash}`
    );
  }

  /**
   * Gets the class instance containing provider-specific logic based on the provided ID.
   * @param providerId - the identifier for a specific utility provider. E.g. paga.
   * @returns the class instance for the specified utility provider.
   */
  static getProviderById(providerId: ProviderId) {
    const provider = idToProviderMap[providerId];
    if (!provider)
      throw new ErrorHandler(
        `No provider logic matching the ID: ${providerId}`,
        false
      );

    return provider;
  }

  static validatePaymentData(data: TPaymentData) {
    const paymentDataValidator = new ObjectValidator(paymentDataRule);

    if (paymentDataValidator.validate(data))
      throw new ErrorHandler("Error validating utility payment data", true, {
        reason: paymentDataValidator.response,
      });
  }
}

const paymentDataRule = {
  customerId: "required|string",
  merchantId: "required|isUtilityMerchantId",
  merchantServiceId: "required|isUtilityMerchantServiceId",
  planData: `required_if:merchantServiceId,${UtilityMerchantService.Plan}`,
  "planData.amount": `required|isNumber`,
  "planData.planCode": "required|string",
  "planData.providerId": "required|isProviderId",
  amount: `required_unless:merchantServiceId,${UtilityMerchantService.Plan}|isNumber`,
} satisfies { [k in keyof Flatten<DeepRequired<TPaymentData>>]?: string };
