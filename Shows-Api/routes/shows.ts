import express from "express";
import * as ShowsController from "../controllers/shows";
import checkAuth from "../middleware/check-auth";

const router = express.Router();

// api/shows/

router.get("/", checkAuth, ShowsController.GetUserShows);

router.get("/:apiId", checkAuth, ShowsController.GetUserShowByApiId);

router.get("/search/:searchShow", checkAuth, ShowsController.SearchShows);

// Removed myTestMiddleware as it appeared to be for debugging and wasn't typed/converted
router.post("/", checkAuth, ShowsController.CreateUserShow);

router.put("/:apiId", checkAuth, ShowsController.UpdateUserShow);

router.delete("/:apiId", checkAuth, ShowsController.deleteUserShow);

export default router;
