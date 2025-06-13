import ErrorHandler from "../../errors/errManager";
import {
  IUtilityStatusTxResult,
  TNairaAdminTxWriteData,
  TNairaMetadataUtilityWriteData,
} from "../../interface/types";
import Path from "../config/path";

/**
 * Ensure that the utility status docs are initialized, and only once.
 * @param uid - uid of user whose utility request is being handled.
 * @param appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param nairaAdminDocPath - full path to the related naira_admin doc.
 */
export default async function initializeUtilityTxStatusDocs(
  uid: string,
  appTxHash: string,
  nairaAdminDocPath: string,
  nairaMetadataData: TNairaMetadataUtilityWriteData,
  nairaAdminData: TNairaAdminTxWriteData
): Promise<IUtilityStatusTxResult> {
  try {
    const utilityStatusTxResult = await Path.nairaFirestore.runTransaction(
      async (trx) => {
        // Lock status docs
        const nairaMetatdataDoc = await trx.get(
          Path.getNairaMetadataDocRef(uid, appTxHash)
        );
        if (nairaMetatdataDoc.exists) return { statusDocsWritten: false }; // prevents utility payments from happening multiple times
        await trx.get(Path.getNairaDocRefByFullPath(nairaAdminDocPath));

        // TODO: see about adding the other metadata (e.g. reference)
        trx
          .set(Path.getNairaMetadataDocRef(uid, appTxHash), nairaMetadataData)
          .update(
            Path.getNairaDocRefByFullPath(nairaAdminDocPath),
            nairaAdminData
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
