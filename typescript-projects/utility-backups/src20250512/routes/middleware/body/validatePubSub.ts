/**
 * - It validates PubSub message
 * - It verifies service JWT
 * - It validates service permission
 */

import { NextFunction, Request, Response } from "express";
import Echo from "../../../helpers/@response";
import ErrorHandler from "../../../errors/errManager";
// import { Utility } from "../../../interface/types";
import ObjectValidator from "../../../helpers/@objectValidator";
import parsedEnv from "../../../helpers/@loadConfig";
import JWT, { encodeJWT } from "../../../helpers/@jwt";

interface PubSubMessage {
  data: string;
  attributes: { [key: string]: string };
  messageId: string;
}

interface ParsedPubSubBody {
  txPath: string;
}

const pubSubValidator = new ObjectValidator({
  message: {
    data: "required|string",
    attributes: "required",
    "attributes.jwt": "required|string",
    messageId: "required|string",
  },
});

const pubSubBodyValidator = new ObjectValidator({
  txPath: "required|string|max:1000",
});

export default function validatePubSub(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const reqBody = req.body;

  try {
    // validate request body
    if (!pubSubValidator.validate(reqBody))
      throw new ErrorHandler("Invalid PubSub message.", true, {
        message: "Invalid PubSub message.",
        cause: pubSubValidator.response,
      });

    // verify service JWT
    const pubMessage = reqBody.message as PubSubMessage;
    const stringifiedBody = Buffer.from(pubMessage.data, "base64").toString(
      "utf8"
    );
    const pubBody = JSON.parse(stringifiedBody) as ParsedPubSubBody;
    const messageAttributes = pubMessage.attributes;
    const jwt = JWT.decode(
      messageAttributes["jwt"],
      parsedEnv.PUBSUB_JWT_SECRET
    ) as encodeJWT;
    if (!jwt) return Echo.ErrorPub(res, "invalid service jwt");

    // validate serviceID permission
    const serviceId = jwt.sub;
    if (!parsedEnv.AUTHORIZED_SERVICES_ID.includes(serviceId))
      return Echo.ErrorPub(res, `serviceId (${serviceId}) not allowed`); // TODO: get authorized service(s)

    // Ensure body is valid
    if (pubSubBodyValidator.validate(pubBody))
      res.locals.txPath = pubBody.txPath;
    else
      return Echo.ErrorPub(res, {
        message: "invalid PubSub message body",
        cause: pubSubBodyValidator.response,
      } as unknown as Error);

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (Object.keys(reqBody).length === 0) {
      // Probably a test/dev request; use hard-coded data
      // TODO: test/dev only
      // res.locals.txPath =
      //   "users_transactions_withdrawal/sE4toJDcBIhVSZqN4SugcpWGwt82/utility/0a5ecb9e5febd56895679124c7dae1328dc42a29ca2d2a23c9947ede21f6eab3";
      return next();
    }

    let defaultError = new ErrorHandler(
      "error validating PubSub message/body",
      false,
      error
    );
    if (error instanceof ErrorHandler) defaultError = error;
    return Echo.HandleResponse(res, defaultError, req.originalUrl);

    // if (!(error instanceof ErrorHandler))
    //   logger.error(error.message, { error });
    // return Echo.ErrorPub(res, "error validating PubSub message/body");
  }
}
