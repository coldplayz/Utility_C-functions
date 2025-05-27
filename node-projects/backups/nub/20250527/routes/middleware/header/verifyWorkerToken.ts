// /**
//  * it verify a worker token
//  * it check if worker have permission to access an endpoint
//  */
//
// import { NextFunction, Request, Response } from "express";
// import ObjectValidator from "../../../helpers/@objectValidator";
// import Echo from "../../../helpers/@response";
// import { logger } from '../../../helpers/@logger';
// import JWT, { encodeJWT } from "../../../helpers/@jwt";
// import { RouteGuard } from "../../path";
//
// const workerTokenJWT = process.env.WORKER_TOKEN_JWT as string;
// const compareHeader = new ObjectValidator({
//     "x-workertoken": "required|isJWT|max:1000",
// });
//
// const errorAuthTokenMessage = "expired or invalid worker token";
//
//
// export default async (req: Request, res: Response, next: NextFunction) => {
//
//     try {
//
//         // Validate token
//         if (!compareHeader.validate(req.headers)) return Echo.Error(res, compareHeader.response);
//
//         // Verify token
//         const worker = JWT.decode(req.headers["x-workertoken"] as string, workerTokenJWT) as encodeJWT;
//         if (!worker) return Echo.Error(res, errorAuthTokenMessage);
//
//         // Verify worker permission
//         const workerPermission = RouteGuard(req.originalUrl);
//         if (!workerPermission.validate({ ...worker, worker: worker.extra, workerID: worker.secrets })) return Echo.Error(res, workerPermission.response);
//
//         // Store workerID for other MD
//         res.locals.workerID = worker.secrets;
//
//         // Move to next
//         next();
//
//     } catch (error) {
//         logger.error(error);
//         Echo.Failed(res);
//     }
// }