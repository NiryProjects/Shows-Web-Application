const express = require("express");


const showsGameRoutes = require("./routes/showsGame");
const testingRoutes = require("./routes/testing");
const userRoutes = require("./routes/user");
const showsRoutes = require("./routes/shows");
const friendsRoutes = require("./routes/friends");



const app = express();


const connectToMyMongo = require("./connectDb");

// Load environment variables from .env file
require("dotenv").config();

////// invoke connection to mongoDB
connectToMyMongo();



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.get("/api/health", (req, res, next) => { res.status(200).json({ health: "Online ! :)" }); });


app.use("/api/shows", showsRoutes);


app.use("/api/showsgame", showsGameRoutes);


app.use("/api/test", testingRoutes);


app.use("/api/user", userRoutes);


app.use("/api/friends", friendsRoutes);





module.exports = app;
