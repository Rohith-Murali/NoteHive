import express from "express";
import { getUserDetails, updateUserDetails } from "../controllers/userDetailsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUserDetails);
router.put("/", protect, updateUserDetails);

export default router;
