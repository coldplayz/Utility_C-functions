import { Request, Response, Router } from "express";
import { approveBillMD, processBillMD, reverseBillMD } from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import ProcessBill from "./service/processBill";
import ApproveBill from "./service/approveBill";
import ReverseBill from "./service/reverseBill";

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
        new ProcessBill({
          key: "key",
        })
          .execute()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.approveBill, corsResponse)
    .post(
      routePath.approveBill,
      approveBillMD,
      (req: Request, res: Response) => {
        new ApproveBill({
          key: "key",
        })
          .execute()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.reverseBill, corsResponse)
    .post(
      routePath.reverseBill,
      reverseBillMD,
      (req: Request, res: Response) => {
        new ReverseBill({
          key: "key",
        })
          .execute()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  return route;
};
