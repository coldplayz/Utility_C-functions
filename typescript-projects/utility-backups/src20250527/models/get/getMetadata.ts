// import ErrorHandler from "../../errors/errManager";
// import { Flatten, TNairaMetadataUtilityWriteData } from "../../interface/types";
// import ObjectValidator from "../../helpers/@objectValidator";
// import Obtain from "./obtain";
// import ConfigDB from "../config/configDB";

// const metadataDocRule = {
//   utilityStatus: "required|isAppTxStatus",
//   providerId: "required|isProviderId",
//   txPath: "required|string",
//   appOrderId: "required|string",
//   providerOrderId: "string",
// } satisfies { [k in keyof Flatten<TNairaMetadataUtilityWriteData>]?: string };
// const metadataDocValidator = new ObjectValidator(metadataDocRule);

// /**
//  * Get and validate data related to a utility bill payment metadata.
//  * @param metadataPath - full path to the naira_metadata doc for the utility.
//  * @returns object containing metadata saved during payment processing.
//  */
// export default async function getMetadata(metadataPath: string) {
//   try {
//     // Get data at metadata doc
//     const metadata = await Obtain.dataByDocRef<TNairaMetadataUtilityWriteData>(
//       ConfigDB.getNairaDocRefByFullPath(metadataPath)
//     );

//     // Validate it
//     if (!metadataDocValidator.validate(metadata))
//       throw new ErrorHandler("Error validating metadata doc.", false, {
//         cause: metadataDocValidator.response,
//       });

//     return metadata;
//   } catch (error) {
//     if (error instanceof ErrorHandler) throw error;
//     throw new ErrorHandler(
//       `error fetching metadata at: ${metadataPath}`,
//       false,
//       error
//     );
//   }
// }
