import * as trashService from "../services/trashService.js";
import asyncHandler from "express-async-handler";
import { sendSuccess } from "../utils/response.js";
import logger from "../utils/logger.js";

export const getTrash = asyncHandler(async (req, res) => {
  logger.info(`Fetching trash items for user ${req.user._id}`);
  const data = await trashService.getTrashItems(req.user._id);
  return sendSuccess(res, 200, data, "Trash items fetched successfully");
});

export const restore = asyncHandler(async (req, res) => {
  const item = await trashService.restoreItem(
    req.params.type,
    req.params.id,
    req.user._id,
  );
  return sendSuccess(res, 200, item, "Item restored successfully");
});

export const permanentDelete = asyncHandler(async (req, res) => {
  const item = await trashService.permanentDeleteItem(
    req.params.type,
    req.params.id,
    req.user._id,
  );
  return sendSuccess(res, 200, item, "Item deleted permanently");
});
