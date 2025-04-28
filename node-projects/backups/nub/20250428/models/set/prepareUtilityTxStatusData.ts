import {
  AppTxStatus,
  TNairaAdminTxWriteData,
  TNairaMetadataUtilityWriteData,
} from "../../interface/types";
import NairaAdminCollectionSchema from "../schema/_nairaAdminCollectionSchema";
import NairaMetadataCollectionSchema from "../schema/_nairaMetadataCollectionSchema";

/**
 * Prepares and validates data to set on payment status update.
 * @param status - status of the utility payment request.
 * @param metadata - other data to add in naira metadata doc.
 * @param nairadata - other data to add in naira admin doc.
 * @returns update/set data for naira_admins and naira_metadata collections.
 */
export default function prepareUtilityTxStatusData(
  status?: AppTxStatus,
  metadata?: Omit<TNairaMetadataUtilityWriteData, "utilityStatus">,
  nairadata?: Omit<TNairaAdminTxWriteData, "utilityStatus">
) {
  const nairaMetadata: TNairaMetadataUtilityWriteData = {
    ...(status && { utilityStatus: status }),
    ...metadata,
  };
  const nairaAdmindata: TNairaAdminTxWriteData = {
    ...(status && { utilityStatus: status }),
    ...nairadata,
  };

  new NairaMetadataCollectionSchema(nairaMetadata).validate();
  new NairaAdminCollectionSchema(nairaAdmindata).validate();

  return {
    nairaAdmindata:
      Object.keys(nairaAdmindata).length > 0 ? nairaAdmindata : undefined,
    nairaMetadata:
      Object.keys(nairaMetadata).length > 0 ? nairaMetadata : undefined,
  };
}
