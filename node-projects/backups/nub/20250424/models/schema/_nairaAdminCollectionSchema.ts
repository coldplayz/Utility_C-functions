/**
 * Note:
 *
 * This class ensures that data being written to the DB is valid.
 */

import { TNairaAdminTxWriteData } from "../../interface/types";
import Schema from "./_schema";

export default class NairaAdminCollectionSchema extends Schema<TNairaAdminTxWriteData> {
  constructor(
    nairaAdminTxWriteData: TNairaAdminTxWriteData,
    public requireList: (keyof TNairaAdminTxWriteData)[] = []
  ) {
    super(nairaAdminTxWriteData);
  }

  rules(): { [k in keyof TNairaAdminTxWriteData]: string } {
    return {
      utilityStatus: `required|isAppTxStatus`,
    };
  }
}
