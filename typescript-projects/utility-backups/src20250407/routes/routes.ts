import { Request, Response, Router } from "express";
import { approveBillMD, processBillMD } from "./middleware";
import Status from "./service/status";
import Echo from "../helpers/@response";
import { corsResponse } from "./middleware/header/filterCors";
import { routePath } from "./path";
import { Utility } from "../interface/types";
import Airtime from "./service/airtime";
import Bet from "./service/bet";
import CableTv from "./service/cableTv";
import Electricity from "./service/electricity";
import Internet from "./service/internet";

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
          return new Airtime({ key: "key" })
            .processPayment()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        if (utility === Utility.Internet)
          return new Internet({ key: "key" })
            .processPayment()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

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
        return new Bet({ key: "key" })
          .processPayment()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.processCableTv, corsResponse)
    .post(
      routePath.processCableTv,
      processBillMD,
      (req: Request, res: Response) => {
        return new CableTv({ key: "key" })
          .processPayment()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
      }
    );

  route
    .options(routePath.processElectricity, corsResponse)
    .post(
      routePath.processElectricity,
      processBillMD,
      (req: Request, res: Response) => {
        return new Electricity({ key: "key" })
          .processPayment()
          .then((data) => Echo.HandleResponse(res, data))
          .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));
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
          return new Airtime({ key: "key" })
            .processStatus()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        if (utility === Utility.Bet)
          return new Bet({ key: "key" })
            .processStatus()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        if (utility === Utility.Cable)
          return new CableTv({ key: "key" })
            .processStatus()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        if (utility === Utility.Electricity)
          return new Electricity({ key: "key" })
            .processStatus()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        if (utility === Utility.Internet)
          return new Internet({ key: "key" })
            .processStatus()
            .then((data) => Echo.HandleResponse(res, data))
            .catch((error) => Echo.HandleResponse(res, error, req.originalUrl));

        return Echo.Error(
          res,
          `'utility' query param invalid. Expected: ${Object.values(Utility)}`
        );
      }
    );

  return route;
};
