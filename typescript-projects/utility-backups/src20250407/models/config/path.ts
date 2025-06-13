// import {getFirestore} from 'firebase-admin/firestore';
// import {getAuth} from 'firebase-admin/auth';
// import initApp from '../firebase';
// import {day, month, year} from "../../helpers/@time";
//
// const coreApp = initApp.core();
// const coreDB = getFirestore(coreApp);
//
// const giftcardApp = initApp.giftcard();
// const giftcardDB = getFirestore(giftcardApp);
//
// export default class Path {
//
//     static Auth = getAuth(giftcardApp);
//
//     static GiftcardDB = giftcardDB;
//
//     static DocPath(path: string): FirebaseFirestore.DocumentReference {
//         if (!path)
//             throw new Error("Invalid document path provided.");
//         return giftcardDB.doc(path);
//     }
//
//     static CoreDocPath(path: string): FirebaseFirestore.DocumentReference {
//         if (!path)
//             throw new Error("Invalid document path provided.");
//         return coreDB.doc(path);
//     }
//
//     static AdminNGN(docID: string) {
//         if (!docID) throw new Error("Invalid document ID provided.");
//         return `naira_admins/${year()}/${month()}/${day()}/transactions/${docID}`
//     }
// }