import { Request, Response, Router } from "express";
import {
  processBetMD,
  processCableTvMD,
  processElectricityMD,
  processMobileMD,
  processStatusMD,
} from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import { UtilityProduct } from "../interface/types";
import Mobile from "./service/mobile/mobile";
import Bet from "./service/bet/bet";
import CableTv from "./service/cableTv/cableTv";
import Electricity from "./service/electricity/electricity";
import ProcessStatus from "./service/utilityStatus/processStatus";

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
    .options(routePath.processMobile, corsResponse)
    .post(
      routePath.processMobile,
      processMobileMD,
      (req: Request, res: Response) => {
        const utilityMerchantService = res.locals
          .utilityMerchantService as UtilityProduct;

        if (utilityMerchantService === UtilityProduct.Airtime)
          return new Mobile().processAirtime(req, res);

        if (utilityMerchantService === UtilityProduct.Plan)
          return new Mobile().processInternet(req, res);

        return Echo.Error(
          res,
          `Invalid utility merchant service. Expected: airtime,internet. Got ${utilityMerchantService} in router`
        );
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
        return new CableTv().processCableTv(req, res);
      }
    );

  route
    .options(routePath.processElectricity, corsResponse)
    .post(
      routePath.processElectricity,
      processElectricityMD,
      (req: Request, res: Response) => {
        return new Electricity().processElectricity(req, res);
      }
    );

  route
    .options(routePath.processStatus, corsResponse)
    .post(
      routePath.processStatus,
      processStatusMD,
      (req: Request, res: Response) => {
        return new ProcessStatus().execute(req, res);
      }
    );

  return route;
};
