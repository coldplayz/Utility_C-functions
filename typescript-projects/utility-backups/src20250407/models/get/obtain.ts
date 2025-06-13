import { DocumentReference, DocumentSnapshot } from "firebase-admin/firestore";
import { logger } from "../../helpers/@logger";

class Obtain {
    static async byDocPath(path: DocumentReference): Promise<Record<string, any> | false> {
        try {
            const resp: DocumentSnapshot = await path.get();
            return resp.exists ? resp.data() as Record<string, any> : false;
        } catch (error) {
            logger.log({ level: 'error', message: "Unable to get data", severity: "Error", error })
            throw new Error('Unable to get data');
        }
    }
}

export default Obtain;
