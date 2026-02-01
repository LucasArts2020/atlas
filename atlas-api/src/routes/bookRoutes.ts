import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  BookController,
  FavoriteController,
  ActivityController,
} from "../controllers/bookController";

const router = Router();

// Books CRUD
router.post("/books", authMiddleware, BookController.createBook);
router.get("/books", authMiddleware, BookController.listBooks);
router.get("/books/:id", authMiddleware, BookController.getBook);
router.put("/books/:id", authMiddleware, BookController.updateBook);
router.delete("/books/:id", authMiddleware, BookController.deleteBook);

// Favorites
router.get("/favorites", authMiddleware, FavoriteController.listFavorites);
router.get(
  "/books/:id/is-favorite",
  authMiddleware,
  FavoriteController.isFavorite,
);
router.post(
  "/books/:id/favorite",
  authMiddleware,
  FavoriteController.addFavorite,
);
router.delete(
  "/books/:id/favorite",
  authMiddleware,
  FavoriteController.removeFavorite,
);

// Activity
router.get("/profile/activity", authMiddleware, ActivityController.getActivity);

export { router as bookRoutes };
