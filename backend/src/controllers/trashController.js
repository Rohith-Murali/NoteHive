import * as trashService from "../services/trashService.js";
import asyncHandler from "express-async-handler";

export const getTrash = asyncHandler(async (req, res) => {
    const data = await trashService.getTrashItems(req.user._id);
    res.json(data);
});

export const restore = asyncHandler(async (req, res) => {
    const item = await trashService.restoreItem(req.params.type, req.params._id, req.user._id);
    res.json({ message: "Restored successfully", item });
})

export const permanentDelete = asyncHandler(async (req, res) => {
    const item = await trashService.permanentDeleteItem(req.params.type, req.params._id, req.user._id);
    res.json({ message: "Deleted permanently", item });
})