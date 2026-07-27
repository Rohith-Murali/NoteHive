import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", validateRequest(refreshSchema), refresh);
router.post("/logout", validateRequest(logoutSchema), logout);
router.put(
  "/update-password",
  protect,
  validateRequest(changePasswordSchema),
  changePassword,
);

export default router;
