import mongoose from "mongoose";

const connectToMongo = (): void => {
  const dbUser = process.env.DbUser;
  const dbString = process.env.DbString;

  if (!dbUser || !dbString) {
    console.error("Missing DbUser or DbString environment variables!");
    process.exit(1);
  }

  const uri = `mongodb+srv://${dbUser}:${dbString}@cluster0-shows-app.ljiuw6y.mongodb.net/TesttDatabase?retryWrites=true&w=majority`;

  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.error(err.reason);
      console.error("Connection failed!");
    });
};

export default connectToMongo;
