import ErrorHandler from "../../../errors/errManager";
import { logger } from "../../../helpers/@logger";
import {
  AppTxStatus,
  ProviderId,
  TStatusDocsWriteTxData,
} from "../../../interface/types";
import providerX from "../../../lib/external/providerX";
import prepareUtilityTxStatusData from "../../../models/set/prepareUtilityTxStatusData";
import updateUtilityTxStatusDocs from "../../../models/set/updateUtilityTxStatusDocs";

export default class BaseUtility {
  static idToProviderMap = {
    [ProviderId.ProviderX.toLowerCase()]: providerX,
  };

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
    const provider = this.idToProviderMap[providerId.toLowerCase()];
    if (!provider)
      throw new ErrorHandler(
        `No provider logic matching the ID: ${providerId}`,
        false
      );

    return provider;
  }
}
