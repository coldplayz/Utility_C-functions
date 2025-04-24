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
 * @returns update/set data for naira_admins and naira_metadata collections.
 */
export default function prepareUtilityTxStatusData(status: AppTxStatus) {
  const nairaMetadataData: TNairaMetadataUtilityWriteData = {
    utilityStatus: status,
  };
  const nairaAdminData: TNairaAdminTxWriteData = {
    utilityStatus: status,
  };

  new NairaMetadataCollectionSchema(nairaMetadataData).validate();
  new NairaAdminCollectionSchema(nairaAdminData).validate();

  return { nairaAdminData, nairaMetadataData };
}
