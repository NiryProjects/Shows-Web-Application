const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Validators = require("../validators");
const sendMail = require("../sendmail");
const createPassword = require("../makePassword");


exports.createUser = async (req, res, next) => {

    const password = req.body.password;
    const email = req.body.email;
    const username = req.body.username;

    if (!Validators.isEmailValid(email)) {
        res.status(400).json({
            message: "Invalid authentication credentials! email is not in the right format!"
        });
        return;
    }

    if (!Validators.isUsernameValid(username)) {
        res.status(400).json({
            message: "Invalid authentication credentials! username not in the right format!"
        });
        return;
    }


    if (!Validators.createPasswordStrengthValidator(password)) {
        res.status(400).json({
            message: "Invalid authentication credentials! password is too weak!"
        });
        return;
    }

    const userLookedByEmail = await User.findOne({ email: req.body.email });
    const userLookedByUsername = await User.findOne({ username: req.body.username });

    if (userLookedByEmail || userLookedByUsername) {
        console.log("User in the database");
        console.log(` userLookedByEmail ${userLookedByEmail ? true : false}`);
        console.log(req.body.email)
        console.log(` userLookedByUsername ${userLookedByUsername ? true : false}`);
        console.log(req.body.username)


        return res.status(500).json({
            message: "Invalid authentication credentials! User in the database."
        });
    }

    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash
        });
        user
            .save()
            .then(result => {
                res.status(201).json({
                    message: "User created!",
                    email: result.email,
                    username: result.username,
                    // result: result,
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    }).catch(error => res.status(400).json({ error }));
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    let isUserFound = false;

    const email = req.body.email;

    if (!Validators.isEmailValid(email)) {
        res.status(400).json({
            message: "Invalid authentication credentials! email is not in the right format!"
        });
        return;
    }

    User.findOne({ email })
        .then(user => {

            if (!user) {
                res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
                return false;
            }
            isUserFound = true;
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                if (isUserFound) {
                    res.status(401).json({
                        message: "Auth failed"
                        // message: "Invalid authentication credentials! email/password must be wrong ..."
                    });
                }
                return res;
            }

            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                username: fetchedUser.username
            });
        }).catch(error => {
            res.status(400).json({ error });
        });
}

exports.userChangePassword = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    console.log(password, email, newPassword);

    if (!Validators.isEmailValid(email)) {
        res.status(400).json({
            message: "Invalid authentication credentials! email is not in the right format!"
        });
        return;
    }

    if (!Validators.createPasswordStrengthValidator(newPassword)) {
        res.status(400).json({
            message: "Invalid authentication credentials!" // new password is too weak!
        });
        return;
    }

    try {

        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                message: "Invalid authentication credentials! email/password must be wrong ..."
            });
            return;
        }

        const checkThePassword = await bcrypt.compare(password, user.password);

        if (!checkThePassword) {
            res.status(400).json({
                message: "Failed to change password! password is wrong ..."
            });
            return;
        }

        const userFoundAndUpdated = await ChangePasswordfindAndUpate(email, newPassword);

        if (!userFoundAndUpdated) {
            res.status(400).json({
                message: "Failed to change password!"
            });
            return;
        }

        res.status(200).json({
            message: "password is changed!"
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to change password!", error });
    }
}

const ChangePasswordfindAndUpate = async (email, newPassword) => {
    const hash = await bcrypt.hash(newPassword, 10);

    const filter = { email };
    const update = { password: hash };

    const userFoundAndUpdated = await User.findOneAndUpdate(filter, update, {
        returnOriginal: false
    });

    return userFoundAndUpdated;
};

exports.userForgotPassword = async (req, res, next) => {

    try {

        const email = req.body.email;
        const username = req.body.username;

        // console.log(email, username);

        const user = await User.findOne({ email, username });

        if (!user) {
            res.status(400).json({
                message: "Failed to find the user!"
            });
            return;
        }

        const newPassword = createPassword.GetPassword();
        const acceptedMail = await sendMail.sendMail(email, username, newPassword);

        if (acceptedMail <= 0) {
            res.status(500).json({
                message: "Internal server error, please try in other time.",
                error: "Error with email server, please try in other time."
            });
            return;
        }

        const userUpdated = await await ChangePasswordfindAndUpate(email, newPassword);

        if (!userUpdated) {
            res.status(500).json({
                message: "Internal server error, please try in other time.",
                error: "Error with email server, please try in other time."
            });
            return;
        }

        res.status(200).json({
            message: "user found, sending/sent mail ..."
        });

    }
    catch (error) {
        res.status(500).json({ message: "Failed to change password!", error });
    }
}
