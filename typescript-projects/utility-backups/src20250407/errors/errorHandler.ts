import {Request, Response, NextFunction} from "express";
import Echo from "../helpers/@response";
import {logger} from "../helpers/@logger";

function generalError(error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof SyntaxError && 'body' in error) {
    Echo.Error(res, 'invalid request body');
  } else {
    logger.error(error);
    Echo.Failed(res)
    next(error);
  }

}

function invalidRoute(req: Request, res: Response) {
  Echo.NotFound(res, "null");
}

export default [generalError, invalidRoute];