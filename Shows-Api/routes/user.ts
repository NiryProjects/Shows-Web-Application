import express from "express";

const router = express.Router();

// Controllers and middleware are still JS — use require() for compatibility
const UserController = require("../controllers/user");
const myTestMiddleware = require("../middleware/my-tests-middleware");

router.post("/signup", myTestMiddleware, UserController.createUser);

router.post("/login", myTestMiddleware, UserController.userLogin);

router.post("/changepassword", myTestMiddleware, UserController.userChangePassword);

router.post("/forgotpassword", myTestMiddleware, UserController.userForgotPassword);

export default router;
