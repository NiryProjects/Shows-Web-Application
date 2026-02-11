import express from "express";
import * as ShowsGameController from "../controllers/showsGame";

const router = express.Router();

router.get("/tv", ShowsGameController.GetShowsGameTv);
router.get("/movies", ShowsGameController.GetShowsGameMovies);

export default router;
