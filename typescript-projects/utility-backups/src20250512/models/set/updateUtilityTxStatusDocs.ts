import ErrorHandler from "../../errors/errManager";
import { logger } from "../../helpers/@logger";
import { AppTxStatus } from "../../interface/enums";
import {
  TNairaAdminTxWriteData,
  TNairaMetadataUtilityWriteData,
  TStatusDocsAccessData,
} from "../../interface/types";
import ConfigDB from "../config/configDB";
import prepareUtilityTxStatusData from "./prepareUtilityTxStatusData";

/**
 * Update specific docs with the status of a provider utility payment transaction.
 * @param statusDocsAccessData - data for accessing the documents to write.
 * @param statusDocsAccessData.uid - uid of user whose utility request is being handled.
 * @param statusDocsAccessData.appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param statusDocsAccessData.nairaAdminDocPath - full path to the related naira_admin doc.
 * @param options.status - utility payment transaction status to update docs with.
 * @param options.metadata - other data to write to the naira metadata doc.
 * @param options.nairadata - other data to write to the naira admin doc.
 */
export default async function updateUtilityTxStatusDocs(
  statusDocsAccessData: TStatusDocsAccessData,
  options?: {
    status?: AppTxStatus;
    metadata?: Omit<TNairaMetadataUtilityWriteData, "utilityStatus">;
    nairadata?: Omit<TNairaAdminTxWriteData, "utilityStatus">;
  }
) {
  try {
    await ConfigDB.nairaFirestore.runTransaction(async (trx) => {
      // Lock status docs
      await trx.get(
        ConfigDB.getNairaMetadataDocRef(
          statusDocsAccessData.uid,
          statusDocsAccessData.appTxHash
        )
      );
      await trx.get(
        ConfigDB.getNairaDocRefByFullPath(
          statusDocsAccessData.nairaAdminDocPath
        )
      );

      // Get docs data
      const updateData = prepareUtilityTxStatusData(
        options?.status,
        options?.metadata,
        options?.nairadata
      );

      if (updateData.nairaMetadata)
        trx.update(
          ConfigDB.getNairaMetadataDocRef(
            statusDocsAccessData.uid,
            statusDocsAccessData.appTxHash
          ),
          updateData.nairaMetadata
        );
      if (updateData.nairaAdmindata)
        trx.update(
          ConfigDB.getNairaDocRefByFullPath(
            statusDocsAccessData.nairaAdminDocPath
          ),
          updateData.nairaAdmindata
        );

      logger.info(
        `${options?.status || "No"} status set for uid: ${
          statusDocsAccessData.uid
        } and txHash: ${statusDocsAccessData.appTxHash}`
      );

      return { statusDocsWritten: true };
    });
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(
      "error running 'updateUtilityTxStatusDocs' transaction",
      false,
      error
    );
  }
}
