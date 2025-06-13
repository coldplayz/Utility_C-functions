/**
 * Note:
 *
 * This class ensures that data being written to the DB is valid.
 */

import {
  DeepRequired,
  Flatten,
  TNairaMetadataUtilityWriteData,
} from "../../interface/types";
import Schema from "./_schema";

export default class NairaMetadataCollectionSchema extends Schema<TNairaMetadataUtilityWriteData> {
  constructor(
    nairaMetadataUtilityWriteData: TNairaMetadataUtilityWriteData,
    public requireList: (keyof TNairaMetadataUtilityWriteData)[] = []
  ) {
    super(nairaMetadataUtilityWriteData);
  }

  rules(): { [k in keyof TNairaMetadataUtilityWriteData]: string } {
    /** Maps all required fields to the corresponding `required` rule */
    const require = this.requireList.reduce((map, requiredFieldPath) => {
      map[requiredFieldPath] = "required|";
      return map;
    }, {} as { [K in keyof Flatten<DeepRequired<TNairaMetadataUtilityWriteData>>]: `required|` });

    return {
      utilityStatus: `${require["utilityStatus"] || ""}isAppTxStatus`,
      appOrderId: `${require["appOrderId"] || ""}isFirestoreStringField`,
      providerOrderId: `${
        require["providerOrderId"] || ""
      }isFirestoreStringField`,
      txPath: `${require["txPath"] || ""}isFirestoreStringField`,
      providerId: `${require["providerId"] || ""}isProviderId`,
    };
  }
}
