import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  createPasswordStrengthValidator,
  isEmailValid,
  isUsernameValid,
} from "../src/utils/validators";
const sendMail = require("../sendmail");
const createPassword = require("../makePassword");

// ─── Request Body Interfaces ────────────────────────────────────────────────

interface SignupBody {
  email: string;
  password: string;
  username: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ChangePasswordBody {
  email: string;
  password: string;
  newPassword: string;
}

interface ForgotPasswordBody {
  email: string;
  username: string;
}

// ─── Handlers ───────────────────────────────────────────────────────────────

export const createUser = async (
  req: Request<any, any, SignupBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, email, username } = req.body;

  if (!isEmailValid(email)) {
    res.status(400).json({
      message:
        "Invalid authentication credentials! email is not in the right format!",
    });
    return;
  }

  if (!isUsernameValid(username)) {
    res.status(400).json({
      message:
        "Invalid authentication credentials! username not in the right format!",
    });
    return;
  }

  if (!createPasswordStrengthValidator(password)) {
    res.status(400).json({
      message:
        "Invalid authentication credentials! password is too weak!",
    });
    return;
  }

  const userLookedByEmail = await User.findOne({ email });
  const userLookedByUsername = await User.findOne({ username });

  if (userLookedByEmail || userLookedByUsername) {
    console.log("User in the database");
    console.log(` userLookedByEmail ${userLookedByEmail ? true : false}`);
    console.log(email);
    console.log(` userLookedByUsername ${userLookedByUsername ? true : false}`);
    console.log(username);

    res.status(500).json({
      message:
        "Invalid authentication credentials! User in the database.",
    });
    return;
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({ email, username, password: hash });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User created!",
            email: result.email,
            username: result.username,
          });
        })
        .catch((err: unknown) => {
          res.status(500).json({
            message: "Invalid authentication credentials!",
          });
        });
    })
    .catch((err: unknown) => {
      res.status(400).json({ error: err });
    });
};

export const userLogin = (
  req: Request<any, any, LoginBody>,
  res: Response,
  next: NextFunction
): void => {
  let fetchedUser: any;
  let isUserFound = false;

  const { email } = req.body;

  if (!isEmailValid(email)) {
    res.status(400).json({
      message:
        "Invalid authentication credentials! email is not in the right format!",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).json({
          message: "Invalid authentication credentials!",
        });
        return false;
      }
      isUserFound = true;
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        if (isUserFound) {
          res.status(401).json({
            message: "Auth failed",
          });
        }
        return res;
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        username: fetchedUser.username,
      });
    })
    .catch((err: unknown) => {
      res.status(400).json({ error: err });
    });
};

export const userChangePassword = async (
  req: Request<any, any, ChangePasswordBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, newPassword } = req.body;

  console.log(password, email, newPassword);

  if (!isEmailValid(email)) {
    res.status(400).json({
      message:
        "Invalid authentication credentials! email is not in the right format!",
    });
    return;
  }

  if (!createPasswordStrengthValidator(newPassword)) {
    res.status(400).json({
      message: "Invalid authentication credentials!",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message:
          "Invalid authentication credentials! email/password must be wrong ...",
      });
      return;
    }

    const checkThePassword = await bcrypt.compare(password, user.password);

    if (!checkThePassword) {
      res.status(400).json({
        message: "Failed to change password! password is wrong ...",
      });
      return;
    }

    const userFoundAndUpdated = await changePasswordFindAndUpdate(
      email,
      newPassword
    );

    if (!userFoundAndUpdated) {
      res.status(400).json({
        message: "Failed to change password!",
      });
      return;
    }

    res.status(200).json({
      message: "password is changed!",
    });
  } catch (error: unknown) {
    res.status(500).json({ message: "Failed to change password!", error });
  }
};

// ─── Helper ─────────────────────────────────────────────────────────────────

const changePasswordFindAndUpdate = async (
  email: string,
  newPassword: string
) => {
  const hash = await bcrypt.hash(newPassword, 10);

  const filter = { email };
  const update = { password: hash };

  const userFoundAndUpdated = await User.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });

  return userFoundAndUpdated;
};

// ─── Forgot Password ───────────────────────────────────────────────────────

export const userForgotPassword = async (
  req: Request<any, any, ForgotPasswordBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
      res.status(400).json({
        message: "Failed to find the user!",
      });
      return;
    }

    const newPassword: string = createPassword.GetPassword();
    const acceptedMail: number = await sendMail.sendMail(
      email,
      username,
      newPassword
    );

    if (acceptedMail <= 0) {
      res.status(500).json({
        message: "Internal server error, please try in other time.",
        error: "Error with email server, please try in other time.",
      });
      return;
    }

    const userUpdated = await changePasswordFindAndUpdate(email, newPassword);

    if (!userUpdated) {
      res.status(500).json({
        message: "Internal server error, please try in other time.",
        error: "Error with email server, please try in other time.",
      });
      return;
    }

    res.status(200).json({
      message: "user found, sending/sent mail ...",
    });
  } catch (error: unknown) {
    res.status(500).json({ message: "Failed to change password!", error });
  }
};
