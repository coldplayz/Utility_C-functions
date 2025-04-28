import {
  DocumentReference,
  WriteResult,
  SetOptions,
  Transaction,
} from "firebase-admin/firestore";

class Deposit {
  static async setDoc<DataType extends Record<string, unknown>>(
    docPath: DocumentReference,
    data: DataType,
    setOptions: SetOptions
  ): Promise<WriteResult> {
    return docPath.set(data, setOptions);
  }

  static async updateDoc<DataType extends Record<string, unknown>>(
    docPath: DocumentReference,
    data: DataType
  ): Promise<WriteResult> {
    return docPath.update(data);
  }

  static async setDocWithTransaction<DataType extends Record<string, unknown>>(
    trx: Transaction,
    docPath: DocumentReference,
    data: DataType,
    overwrite = false
  ): Promise<void> {
    const doc = await trx.get(docPath);
    if (!doc.exists) {
      trx.set(docPath, data);
    } else if (doc.exists && overwrite) {
      trx.set(docPath, data);
    } else {
      throw new Error(`unable to set data in transaction at path: ${docPath}`);
    }
  }
}

export default Deposit;
