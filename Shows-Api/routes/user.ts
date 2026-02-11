import express from "express";
import * as UserController from "../controllers/user";

const router = express.Router();

// Middleware is still JS — use require() for compatibility
const myTestMiddleware = require("../middleware/my-tests-middleware");

router.post("/signup", myTestMiddleware, UserController.createUser);

router.post("/login", myTestMiddleware, UserController.userLogin);

router.post("/changepassword", myTestMiddleware, UserController.userChangePassword);

router.post("/forgotpassword", myTestMiddleware, UserController.userForgotPassword);

export default router;
