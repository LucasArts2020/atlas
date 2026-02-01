import { Router } from "express";
import { authRoutes } from "./authRoutes";
import { bookRoutes } from "./bookRoutes";
import { profileRoutes } from "./profileRoutes";

const router = Router();

// Mount all routes
router.use(authRoutes);
router.use(bookRoutes);
router.use(profileRoutes);

export { router };
