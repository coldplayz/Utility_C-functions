import ErrorHandler from "../../errors/errManager";
// import { logger } from "../../helpers/@logger";

class Obtain {
  static async dataByDocRef<DataType extends Record<string, unknown>>(
    docRef: FirebaseFirestore.DocumentReference
  ) {
    try {
      const resp: FirebaseFirestore.DocumentSnapshot = await docRef.get();
      const data = resp.data();

      if (!data) throw {};
      return data as DataType;
    } catch (error) {
      const err =
        error instanceof ErrorHandler
          ? error
          : new ErrorHandler(
              `Unable to get data from path: ${docRef.path}`,
              false,
              error
            );
      throw err;

      // logger.log({
      //   level: "error",
      //   message: `Unable to get data from path: ${docRef.path}`,
      //   severity: "Error",
      //   error,
      // });
      // throw new Error("Unable to get data");
    }
  }
}

export default Obtain;
