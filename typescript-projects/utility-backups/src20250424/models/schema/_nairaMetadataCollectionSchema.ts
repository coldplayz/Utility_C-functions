/**
 * Note:
 *
 * This class ensures that data being written to the DB is valid.
 */

import { TNairaMetadataUtilityWriteData } from "../../interface/types";
import Schema from "./_schema";

export default class NairaMetadataCollectionSchema extends Schema<TNairaMetadataUtilityWriteData> {
  constructor(
    nairaMetadataUtilityWriteData: TNairaMetadataUtilityWriteData,
    public requireList: (keyof TNairaMetadataUtilityWriteData)[] = []
  ) {
    super(nairaMetadataUtilityWriteData);
  }

  rules(): { [k in keyof TNairaMetadataUtilityWriteData]: string } {
    return {
      utilityStatus: `required|isAppTxStatus`,
      reference: `${
        this.requireList.includes("reference") ? "required|" : ""
      }isFirestoreStringField`,
      providerId: `${
        this.requireList.includes("providerId") ? "required|" : ""
      }isProviderId`,
      txTimestamp: `${
        this.requireList.includes("txTimestamp") ? "required|" : ""
      }isFirestoreIntegerField`,
    };
  }
}
