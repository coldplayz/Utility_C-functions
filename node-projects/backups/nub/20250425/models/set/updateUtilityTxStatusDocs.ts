import ErrorHandler from "../../errors/errManager";
import {
  TNairaAdminTxWriteData,
  TNairaMetadataUtilityWriteData,
} from "../../interface/types";
import Path from "../config/path";

/**
 * Update the status of a utility payment transaction at the provider.
 * @param uid - uid of user whose utility request is being handled.
 * @param appTxHash - hash of naira withdrawal tx, which also serves as tx doc ID.
 * @param nairaAdminDocPath - full path to the related naira_admin doc.
 */
export default async function updateUtilityTxStatusDocs(
  uid: string,
  appTxHash: string,
  nairaAdminDocPath: string,
  nairaMetadataData: TNairaMetadataUtilityWriteData,
  nairaAdminData: TNairaAdminTxWriteData
) {
  try {
    await Path.nairaFirestore.runTransaction(async (trx) => {
      // Lock status docs
      await trx.get(Path.getNairaMetadataDocRef(uid, appTxHash));
      await trx.get(Path.getNairaDocRefByFullPath(nairaAdminDocPath));

      trx
        .update(Path.getNairaMetadataDocRef(uid, appTxHash), nairaMetadataData)
        .update(
          Path.getNairaDocRefByFullPath(nairaAdminDocPath),
          nairaAdminData
        );

      return { statusDocsWritten: true };
    });
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    throw new ErrorHandler(
      "error running 'updateTxStatusDocs' transaction",
      false,
      error
    );
  }
}
