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
        true
      );

    return provider;
  }

  static validateProcessData(data: TProcessData) {
    const processDataValidator = new ObjectValidator(processDataRule);

    if (!processDataValidator.validate(data))
      throw new ErrorHandler("Error validating utility process data", true, {
        reason: processDataValidator.response,
        invalidData: data,
        source: this.validateProcessData.name,
      });
  }
}

type TProcessData = {
  paymentData: TPaymentData;
  providerId: ProviderId;
  uid: string;
  appTxHash: string;
  nairaAdminDocPath: string;
};

const processDataRule = {
  uid: "required",
  appTxHash: "required",
  nairaAdminDocPath: "required",
  providerId: "required",
  "paymentData.customerId": "required|string",
  "paymentData.merchantId": "required|isUtilityMerchantId",
  "paymentData.merchantServiceId": "required|isUtilityMerchantServiceId",
  "paymentData.planData": `required_if:merchantServiceId,${UtilityMerchantService.Plan}`,
  "paymentData.planData.amount": `required_with:paymentData.planData|isNumber`,
  "paymentData.planData.planCode": "required_with:paymentData.planData|string",
  "paymentData.planData.providerId":
    "required_with:paymentData.planData|isProviderId",
  "paymentData.amount": `required_unless:paymentData.merchantServiceId,${UtilityMerchantService.Plan}|isNumber`,
} satisfies { [k in keyof Flatten<DeepRequired<TProcessData>>]?: string };
