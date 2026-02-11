import express from "express";
import * as TestingController from "../controllers/testing";
import checkAuth from "../middleware/check-auth";
import myTestMiddleware from "../middleware/my-tests-middleware";

const router = express.Router();

router.get("/poll", myTestMiddleware, TestingController.testingPollOnlyXTimes);

router.get(
  "/search/:searchShow",
  myTestMiddleware,
  TestingController.TestExternalApis
);

router.get("/middleware", checkAuth, TestingController.testingMiddleware);

export default router;
