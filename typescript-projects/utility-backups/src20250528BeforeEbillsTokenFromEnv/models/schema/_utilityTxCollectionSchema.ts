/**
 * Note:
 *
 * This class ensures that data being written to the DB is valid.
 */

import {
  DeepRequired,
  Flatten,
  TUtilityWithdrawalWriteData,
} from "../../interface/types";
import Schema from "./_schema";

export default class UtilityTxCollectionSchema extends Schema<
  Partial<FlattenedData>
> {
  constructor(
    nairaMetadataUtilityWriteData: Partial<FlattenedData>,
    public requireList: (keyof FlattenedData)[] = []
  ) {
    super(nairaMetadataUtilityWriteData);
  }

  rules(): { [k in KeyofData]: string } {
    /** Maps all required fields to the corresponding `required` rule */
    const require = this.requireList.reduce((map, requiredFieldPath) => {
      map[requiredFieldPath] = "required|";
      return map;
    }, {} as { [K in KeyofData]: `required|` });

    return {
      utility: `isFirestoreMapField`,
      "utility.status": `${require["utility.status"] || ""}isAppTxStatus`,
      "utility.appOrderId": `${
        require["utility.appOrderId"] || ""
      }isFirestoreStringField`,
      "utility.providerOrderId": `${
        require["utility.providerOrderId"] || ""
      }isFirestoreStringField`,
      "utility.providerId": `${
        require["utility.providerId"] || ""
      }isProviderId`,
      "utility.initiatedAt": `${
        require["utility.initiatedAt"] || ""
      }isFirestoreIntegerField`,
      "utility.acknowledgedAt": `${
        require["utility.acknowledgedAt"] || ""
      }isFirestoreIntegerField`,
      "utility.settledAt": `${
        require["utility.settledAt"] || ""
      }isFirestoreIntegerField`,
      "utility.balanceBefore": `${
        require["utility.balanceBefore"] || ""
      }numeric`,
      "utility.balanceAfter": `${require["utility.balanceAfter"] || ""}numeric`,
      "utility.token": `${require["utility.token"] || ""}string`,
    };
  }
}

type FlattenedData = Flatten<DeepRequired<TUtilityWithdrawalWriteData>>;
type KeyofData = keyof FlattenedData;
