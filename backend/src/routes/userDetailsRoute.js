import express from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../controllers/userDetailsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { userDetailsSchema } from "../validators/userDetails.js";

const router = express.Router();

router.get("/", protect, getUserDetails);
router.put("/", protect, validateRequest(userDetailsSchema), updateUserDetails);

export default router;
