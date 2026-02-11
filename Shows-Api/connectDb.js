const mongoose = require("mongoose");


module.exports = function connectToMyMongo() {
    //////// read form api key env ? !



    const uri = `mongodb+srv://${process.env.DbUser}:${process.env.DbString}@cluster0-shows-app.ljiuw6y.mongodb.net/TesttDatabase?retryWrites=true&w=majority`

    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
    }).then(() => {
        console.log('Connected to database');
    }).catch(err => {
        console.log(err.reason);
        console.log("Connection failed!");
    });

}
