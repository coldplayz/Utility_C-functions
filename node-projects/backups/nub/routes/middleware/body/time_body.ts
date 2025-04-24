import { NextFunction, Request, Response } from "express";
import ObjectValidator from "../../../helpers/@objectValidator";
import Echo from "../../../helpers/@response";

const compareObject = new ObjectValidator({
  format: "required|string|max:20",
});

export default (req: Request, res: Response, next: NextFunction) => {
  compareObject.validate(req.body)
    ? next()
    : Echo.Error(res, compareObject.response as any);
};
