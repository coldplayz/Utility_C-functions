import ErrorHandler from "../../errors/errManager";
import { logger } from "../../helpers/@logger";
import {
  DeepRequired,
  Flatten,
  TNairaAdminTxWriteData,
  TStatusDocsAccessData,
  TUtilityWithdrawalWriteData,
} from "../../interface/types";
import ConfigDB from "../config/configDB";

/**
 * Update specific docs with the status of a provider utility payment transaction.
 * @param statusDocsAccessData - data for accessing the documents to write.
 * @param statusDocsAccessData.uid - uid of user whose utility request is being handled.
 * @param statusDocsAccessData.appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param statusDocsAccessData.nairaAdminDocPath - full path to the related naira_admin doc.
 * @param options.utilityUpdate - other data to write to the `utility` metadata doc.
 * @param options.nairaAdminUpdate - other data to write to the naira admin doc.
 */
export default async function updateUtilityTxStatusDocs(
  statusDocsAccessData: TStatusDocsAccessData,
  options?: {
    utilityUpdate?: UtilityData;
    nairaAdminUpdate?: TNairaAdminTxWriteData;
  }
) {
  try {
    await ConfigDB.nairaFirestore.runTransaction(async (trx) => {
      // Lock status docs
      await trx.get(
        ConfigDB.getUtilityTxDocRef(
          statusDocsAccessData.uid,
          statusDocsAccessData.appTxHash
        )
      );
      await trx.get(
        ConfigDB.getNairaDocRefByFullPath(
          statusDocsAccessData.nairaAdminDocPath
        )
      );

      // Update docs
      if (options?.utilityUpdate)
        trx.update(
          ConfigDB.getUtilityTxDocRef(
            statusDocsAccessData.uid,
            statusDocsAccessData.appTxHash
          ),
          options?.utilityUpdate
        );
      if (options?.nairaAdminUpdate)
        trx.update(
          ConfigDB.getNairaDocRefByFullPath(
            statusDocsAccessData.nairaAdminDocPath
          ),
          options?.nairaAdminUpdate
        );

      const status = options?.utilityUpdate?.["utility.status"];
      logger.info(
        `${status || "No"} status set for uid: ${
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

type UtilityData = Partial<Flatten<DeepRequired<TUtilityWithdrawalWriteData>>>;
