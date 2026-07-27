import { sendError } from "../utils/response.js";

export const validateRequest =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const target = req[source] || {};
      const parsed = schema.parse(target);
      req[source] = parsed;
      next();
    } catch (error) {
      const message = error.issues
        ? error.issues.map((issue) => issue.message).join(", ")
        : error.message;
      return sendError(res, 400, message);
    }
  };
