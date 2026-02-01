import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ProfileController } from "../controllers/profileController";

const router = Router();

// Rota para GET profile
router.get("/profile", authMiddleware, ProfileController.getProfile);

// Rota para PUT profile
router.put("/profile", authMiddleware, ProfileController.updateProfile);

// Rota para alterar senha
router.post(
  "/profile/change-password",
  authMiddleware,
  ProfileController.changePassword,
);

export { router as profileRoutes };
