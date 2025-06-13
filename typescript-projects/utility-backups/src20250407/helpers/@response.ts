import { Response } from "express";
import { logger } from "./@logger";
import ErrorHandler from "../errors/errManager";
import { PubSubRoutePaths } from "../constants";
import { MicroServiceRoutePathVal } from "../interface/types";

export default class Echo {
  static HandleResponse(
    responseObj: Response,
    responseData: unknown,
    originalUrl = ""
  ) {
    const route = originalUrl.replace("/v2", "") as MicroServiceRoutePathVal;
    const isPubSubRoutePath = PubSubRoutePaths.includes(route);
    if (isPubSubRoutePath)
      return Echo.ErrorPub(responseObj, responseData as Error | string);

    if (responseData instanceof ErrorHandler) {
      if (responseData.isSafe)
        return Echo.Error(responseObj, responseData.message);
      else return Echo.Failed(responseObj);
    }

    if (responseData instanceof Error) {
      // Unknown/server error; not logged yet
      logger.error(responseData.message || "something went wrong", {
        responseData,
      });
      return Echo.Failed(responseObj);
    } else {
      // Not an Error object; most likely success data
      // TODO: create a SuccessResponse class and type-check
      return Echo.Passed(responseObj, responseData);
    }
  }

  // Method for a successful response
  static Passed(res: Response, data: unknown): Response {
    return res.status(200).json({
      code: 200,
      data,
      success: true,
    });
  }

  // Method for errors response
  static Error(
    res: Response,
    resError: object | string,
    error?: Error
  ): Response {
    if (error instanceof Error) logger.error(error);

    return res.status(400).json({
      code: 400,
      data: {
        message: "unable to perform operation",
        errors: resError,
      },
      success: false,
    });
  }

  static ErrorPub(res: Response, error?: Error | string): Response {
    if (!(error instanceof ErrorHandler))
      logger.error(
        typeof error === "string" ? error : "Something went wrong.",
        { error }
      );

    return res.status(200).json({
      code: 200,
      data: {
        message: "unable to perform operation",
        reason: error,
      },
      success: false,
    });
  }

  // Method for errors response
  static ErrorService(res: Response, resError: string): Response {
    logger.error(resError);
    return Echo.Error(res, resError);
  }

  // Method for a not found response
  static NotFound(res: Response, errors: string): Response {
    return res.status(404).json({
      code: 404,
      data: {
        message: "request not found",
        errors,
      },
      success: false,
    });
  }

  // Method for a server error response
  static Failed(res: Response, error?: Error): Response {
    if (error) logger.error(error);

    return res.status(500).json({
      code: 500,
      data: {
        message: "error from server",
        errors: "try again",
      },
      success: false,
    });
  }
}
