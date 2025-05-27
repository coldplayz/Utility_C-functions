import ErrorHandler from "../../errors/errManager";
import { logger } from "../../helpers/@logger";
import { AppTxStatus } from "../../interface/enums";
import { IUtilityStatusTxResult } from "../../interface/interfaces";
import {
  TNairaAdminTxWriteData,
  TUtilityWithdrawalWriteData,
  TStatusDocsAccessData,
  TUtilityWithdrawalReadData,
  Flatten,
  DeepRequired,
} from "../../interface/types";
import ConfigDB from "../config/configDB";

/**
 * Ensure that the utility status docs are initialized, and only once.
 * @param statusDocsAccessData - data for accessing the documents to write.
 * @param statusDocsAccessData.uid - uid of user whose utility request is being handled.
 * @param statusDocsAccessData.appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param statusDocsAccessData.nairaAdminDocPath - full path to the related naira_admin doc.
 * @param utilityUpdate - other data to write to the `utility` metadata doc.
 * @param nairaAdminUpdate - other data to write to the naira admin doc.
 */
export default async function initializeUtilityTxStatusDocs(
  statusDocsAccessData: TStatusDocsAccessData,
  utilityUpdate: UtilityData,
  nairaAdminUpdate: TNairaAdminTxWriteData
): Promise<IUtilityStatusTxResult> {
  try {
    const utilityStatusTxResult = await ConfigDB.nairaFirestore.runTransaction(
      async (trx) => {
        // Lock status docs
        const utilityTxData = (
          await trx.get(
            ConfigDB.getUtilityTxDocRef(
              statusDocsAccessData.uid,
              statusDocsAccessData.appTxHash
            )
          )
        ).data() as TUtilityWithdrawalReadData;
        if (utilityTxData?.utility?.status) return { statusDocsWritten: false }; // prevents utility payments from happening multiple times
        await trx.get(
          ConfigDB.getNairaDocRefByFullPath(
            statusDocsAccessData.nairaAdminDocPath
          )
        );

        // Update docs
        if (utilityUpdate)
          trx.update(
            ConfigDB.getUtilityTxDocRef(
              statusDocsAccessData.uid,
              statusDocsAccessData.appTxHash
            ),
            utilityUpdate
          );
        if (nairaAdminUpdate)
          trx.update(
            ConfigDB.getNairaDocRefByFullPath(
              statusDocsAccessData.nairaAdminDocPath
            ),
            nairaAdminUpdate
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

type UtilityData = Partial<Flatten<DeepRequired<TUtilityWithdrawalWriteData>>>;
