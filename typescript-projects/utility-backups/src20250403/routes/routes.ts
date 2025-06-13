import { Request, Response, Router } from "express";
import { approveBillMD, processBillMD, reverseBillMD } from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import ProcessBill from "./service/processBill";
import ApproveBill from "./service/approveBill";
import ReverseBill from "./service/reverseBill";
import { Utility } from "../interface/types";

export default () => {
  const route = Router();

  route
    .options(routePath.serviceStatus, corsResponse)
    .get(routePath.serviceStatus, (req: Request, res: Response) => {
      new Status()
        .executeStatus()
        .then((message) => Echo.Passed(res, { message }))
        .catch((error) => Echo.Error(res, { message: error }));
    });

  route
    .options(routePath.processBill, corsResponse)
    .post(
      routePath.processBill,
      processBillMD,
      (req: Request, res: Response) => {
        const utility = req.query.utility as Utility;
        const processBill = new ProcessBill({ key: "key" });

        switch (utility) {
          case "airtime":
            return processBill
              .airtime()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "bet":
            return processBill
              .bet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "cableTv":
            return processBill
              .cableTv()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "electricity":
            return processBill
              .electricity()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "internet":
            return processBill
              .internet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          default:
            Echo.Error(
              res,
              `'utility' query param invalid. Expected: ${Object.values(
                Utility
              )}`
            );
        }
        // new ProcessBill({
        //   key: "key",
        // })
        //   .execute()
        //   .then((data) => Echo.HandleResponse(res, data))
        //   .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.approveBill, corsResponse)
    .post(
      routePath.approveBill,
      approveBillMD,
      (req: Request, res: Response) => {
        const utility = req.query.utility as Utility;
        const approveBill = new ApproveBill({ key: "key" });

        switch (utility) {
          case "airtime":
            return approveBill
              .airtime()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "bet":
            return approveBill
              .bet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "cableTv":
            return approveBill
              .cableTv()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "electricity":
            return approveBill
              .electricity()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "internet":
            return approveBill
              .internet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          default:
            Echo.Error(
              res,
              `'utility' query param invalid. Expected: ${Object.values(
                Utility
              )}`
            );
        }

        // new ApproveBill({
        //   key: "key",
        // })
        //   .execute()
        //   .then((data) => Echo.HandleResponse(res, data))
        //   .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.reverseBill, corsResponse)
    .post(
      routePath.reverseBill,
      reverseBillMD,
      (req: Request, res: Response) => {
        const utility = req.query.utility as Utility;
        const reverseBill = new ReverseBill({ key: "key" });

        switch (utility) {
          case "airtime":
            return reverseBill
              .airtime()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "bet":
            return reverseBill
              .bet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "cableTv":
            return reverseBill
              .cableTv()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "electricity":
            return reverseBill
              .electricity()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          case "internet":
            return reverseBill
              .internet()
              .then((data) => Echo.HandleResponse(res, data))
              .catch((error) =>
                Echo.HandleResponse(res, error, req.originalUrl)
              );
          default:
            Echo.Error(
              res,
              `'utility' query param invalid. Expected: ${Object.values(
                Utility
              )}`
            );
        }

        // new ReverseBill({
        //   key: "key",
        // })
        //   .execute()
        //   .then((data) => Echo.HandleResponse(res, data))
        //   .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  return route;
};
