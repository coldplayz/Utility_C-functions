/**
 * Exposes paths, or path refs, for specific app [Firestore] databases.
 */

import { getFirestore } from "firebase-admin/firestore";
// import { getAuth } from "firebase-admin/auth";

import InitApp from "../firebase";

// const coreApp = InitApp.core();
// const giftcardApp = InitApp.giftcard();
const nairaApp = InitApp.naira();

export default class Path {
  // static nairaAuth = getAuth(nairaApp);
  static nairaFirestore = getFirestore(nairaApp);

  static getNairaDocRefByFullPath(docPath: string) {
    return this.nairaFirestore.doc(docPath);
  }

  static getNairaMetadataDocRef(uid: string, appTxHash: string) {
    return this.nairaFirestore
      .collection("naira_metadata")
      .doc(uid)
      .collection("utility")
      .doc(appTxHash);
  }
}
