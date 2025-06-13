import { getFirestore, DocumentReference, Transaction, WriteResult } from "firebase-admin/firestore";
import initFirebase from '../firebase';

initFirebase.default();
const db = getFirestore();

class Deposit {
    static async setDoc(docPath: DocumentReference, data: any): Promise<WriteResult> {
        return docPath.set(data);
    }

    static async updateDoc(docPath: DocumentReference, data: any): Promise<WriteResult> {
        return docPath.update(data);
    }

    static async setDocWithTransaction(docPath: DocumentReference, data: any, overwrite = false): Promise<void> {
        return db.runTransaction(async (transaction: Transaction) => {
            const doc = await transaction.get(docPath);
            if (!doc.exists) {
                transaction.set(docPath, data);
            } else if (doc.exists && overwrite) {
                transaction.set(docPath, data);
            } else {
                throw { type: 'safe', message: "cannot set existing transaction" };
            }
        });
    }
}

export default Deposit;

