import { Request, Response, Router } from "express";
import {
  processBetMD,
  processCableTvMD,
  processAirtimeMD,
  processPostpaidMD,
  processPrepaidMD,
  processStatusMD,
  processInternetMD,
} from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import Bet from "./service/bet/bet";
import CableTv from "./service/cableTv/cableTv";
import ProcessStatus from "./service/utilityStatus/processStatus";
import Prepaid from "./service/electricity/prepaid";
import Postpaid from "./service/electricity/postpaid";
import Internet from "./service/mobile/internet";
import Airtime from "./service/mobile/airtime";

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
    .options(routePath.processInternet, corsResponse)
    .post(
      routePath.processInternet,
      processInternetMD,
      (req: Request, res: Response) => {
        return new Internet(req, res).processInternet();
      }
    );

  route
    .options(routePath.processAirtime, corsResponse)
    .post(
      routePath.processAirtime,
      processAirtimeMD,
      (req: Request, res: Response) => {
        return new Airtime(req, res).processAirtime();
      }
    );

  route
    .options(routePath.processBet, corsResponse)
    .post(routePath.processBet, processBetMD, (req: Request, res: Response) => {
      return new Bet(req, res).processBet();
    });

  route
    .options(routePath.processCableTv, corsResponse)
    .post(
      routePath.processCableTv,
      processCableTvMD,
      (req: Request, res: Response) => {
        return new CableTv(req, res).processCableTv();
      }
    );

  route
    .options(routePath.processPostpaid, corsResponse)
    .post(
      routePath.processPostpaid,
      processPostpaidMD,
      (req: Request, res: Response) => {
        return new Postpaid(req, res).processPostpaid();
      }
    );

  route
    .options(routePath.processPrepaid, corsResponse)
    .post(
      routePath.processPrepaid,
      processPrepaidMD,
      (req: Request, res: Response) => {
        return new Prepaid(req, res).processPrepaid();
      }
    );

  route
    .options(routePath.processStatus, corsResponse)
    .post(
      routePath.processStatus,
      processStatusMD,
      (req: Request, res: Response) => {
        return new ProcessStatus(req, res).execute();
      }
    );

  return route;
};
