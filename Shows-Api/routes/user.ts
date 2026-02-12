import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

import myTestMiddleware from "../middleware/my-tests-middleware";

router.post("/signup", myTestMiddleware, UserController.createUser);

router.post("/login", myTestMiddleware, UserController.userLogin);

router.post("/changepassword", myTestMiddleware, UserController.userChangePassword);

router.post("/forgotpassword", myTestMiddleware, UserController.userForgotPassword);

export default router;
