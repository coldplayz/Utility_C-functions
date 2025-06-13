import { Request, Response, Router } from "express";
import { approveBillMD, processBillMD } from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import { Utility } from "../interface/types";
import Mobile from "./service/mobile/mobile";
import Bet from "./service/bet/bet";
import CableTv from "./service/cableTv/cableTv";
import Electricity from "./service/electricity/electricity";

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
      processBillMD,
      (req: Request, res: Response) => {
        const utility = req.query.utility as Utility;

        if (utility === Utility.Airtime)
          return new Mobile({
            originalUrl: req.originalUrl,
            key: "val",
          }).processAirtime(res);

        if (utility === Utility.Internet)
          return new Mobile({
            originalUrl: req.originalUrl,
            key: "val",
          }).processInternet(res);

        return Echo.Error(
          res,
          `'utility' query param invalid. Expected: airtime,internet`
        );
      }
    );

  route
    .options(routePath.processBet, corsResponse)
    .post(
      routePath.processBet,
      processBillMD,
      (req: Request, res: Response) => {
        return new Bet({
          originalUrl: req.originalUrl,
          key: "val",
        }).processBet(res);
      }
    );

  route
    .options(routePath.processCableTv, corsResponse)
    .post(
      routePath.processCableTv,
      processBillMD,
      (req: Request, res: Response) => {
        return new CableTv({
          originalUrl: req.originalUrl,
          key: "val",
        }).processCableTv(res);
      }
    );

  route
    .options(routePath.processElectricity, corsResponse)
    .post(
      routePath.processElectricity,
      processBillMD,
      (req: Request, res: Response) => {
        return new Electricity({
          originalUrl: req.originalUrl,
          key: "val",
        }).processElectricity(res);
      }
    );

  route
    .options(routePath.processStatus, corsResponse)
    .post(
      routePath.processStatus,
      approveBillMD,
      (req: Request, res: Response) => {
        const utility = req.query.utility as Utility;

        if (utility === Utility.Airtime)
          return new Mobile({
            originalUrl: req.originalUrl,
            key: "val",
          }).statusAirtime(res);

        if (utility === Utility.Internet)
          return new Mobile({
            originalUrl: req.originalUrl,
            key: "val",
          }).statusInternet(res);

        if (utility === Utility.Bet)
          return new Bet({
            originalUrl: req.originalUrl,
            key: "val",
          }).statusBet(res);

        if (utility === Utility.Cable)
          return new CableTv({
            originalUrl: req.originalUrl,
            key: "val",
          }).statusCableTv(res);

        if (utility === Utility.Electricity)
          return new Electricity({
            originalUrl: req.originalUrl,
            key: "val",
          }).statusElectricity(res);

        return Echo.Error(
          res,
          `'utility' query param invalid. Expected: ${Object.values(Utility)}`
        );
      }
    );

  return route;
};
