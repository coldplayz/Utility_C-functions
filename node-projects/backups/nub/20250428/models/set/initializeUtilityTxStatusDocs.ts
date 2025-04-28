import ErrorHandler from "../../errors/errManager";
import { logger } from "../../helpers/@logger";
import {
  AppTxStatus,
  IUtilityStatusTxResult,
  TNairaAdminTxWriteData,
  TNairaMetadataUtilityWriteData,
  TStatusDocsAccessData,
} from "../../interface/types";
import Path from "../config/path";
import prepareUtilityTxStatusData from "./prepareUtilityTxStatusData";

/**
 * Ensure that the utility status docs are initialized, and only once.
 * @param statusDocsAccessData - data for accessing the documents to write.
 * @param statusDocsAccessData.uid - uid of user whose utility request is being handled.
 * @param statusDocsAccessData.appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param statusDocsAccessData.nairaAdminDocPath - full path to the related naira_admin doc.
 * @param metadata - other data to write to the naira metadata doc.
 * @param nairadata - other data to write to the naira admin doc.
 */
export default async function initializeUtilityTxStatusDocs(
  statusDocsAccessData: TStatusDocsAccessData,
  metadata?: Omit<TNairaMetadataUtilityWriteData, "utilityStatus">,
  nairadata?: Omit<TNairaAdminTxWriteData, "utilityStatus">
): Promise<IUtilityStatusTxResult> {
  try {
    const utilityStatusTxResult = await Path.nairaFirestore.runTransaction(
      async (trx) => {
        // Lock status docs
        const nairaMetatdataDoc = await trx.get(
          Path.getNairaMetadataDocRef(
            statusDocsAccessData.uid,
            statusDocsAccessData.appTxHash
          )
        );
        if (nairaMetatdataDoc.exists) return { statusDocsWritten: false }; // prevents utility payments from happening multiple times
        await trx.get(
          Path.getNairaDocRefByFullPath(statusDocsAccessData.nairaAdminDocPath)
        );

        // Get docs data
        const updateData = prepareUtilityTxStatusData(
          AppTxStatus.Pending,
          metadata,
          nairadata
        );

        if (updateData.nairaMetadata)
          trx.set(
            Path.getNairaMetadataDocRef(
              statusDocsAccessData.uid,
              statusDocsAccessData.appTxHash
            ),
            updateData.nairaMetadata
          );
        if (updateData.nairaAdmindata)
          trx.update(
            Path.getNairaDocRefByFullPath(
              statusDocsAccessData.nairaAdminDocPath
            ),
            updateData.nairaAdmindata
          );

        logger.info(
          `${AppTxStatus.Pending} status set for uid: ${statusDocsAccessData.uid} and txHash: ${statusDocsAccessData.appTxHash}`
        );

        return { statusDocsWritten: true };
      }
    );
    return utilityStatusTxResult;
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(
      "error running 'initializeTxStatusDocs' transaction",
      false,
      error
    );
  }
}
