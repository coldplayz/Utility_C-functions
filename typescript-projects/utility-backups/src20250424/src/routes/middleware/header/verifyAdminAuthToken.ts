// /**
//  * it verify a request auth token
//  */
// import { NextFunction, Request, Response } from "express";
// import ObjectValidator from "../../../helpers/@objectValidator";
// import Echo from "../../../helpers/@response";
// import { logger } from '../../../helpers/@logger';
// import Path from "../../../models/config/path";
//
// const compareHeader = new ObjectValidator({
//     authtoken: "required|isJWT|max:1000",
// });
//
// const errorAuthTokenMessage = "invalid giftcard auth token";
//
// export default async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Validate auth token header
//         if (!compareHeader.validate(req.headers)) return Echo.Error(res, compareHeader.response);
//
//         // Verify auth token value
//         const authToken: string = req.headers.authtoken as string;
//         await Path.Auth.verifyIdToken(authToken)
//             .catch(error => { Echo.Error(res, errorAuthTokenMessage); throw new Error(error) });
//
//         // Move on to next
//         next();
//     } catch (error) {
//         logger.error(error);
//         Echo.Failed(res);
//     }
// }
//
