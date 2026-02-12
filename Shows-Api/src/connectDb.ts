import mongoose from "mongoose";

const connectToMongo = (): void => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI environment variable!");
    process.exit(1);
  }

  // const uri = `mongodb+srv://${dbUser}:${dbString}@cluster0-shows-app.ljiuw6y.mongodb.net/TesttDatabase?retryWrites=true&w=majority`;

  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.error(err);
      console.error("Connection failed!");
    });
};

export default connectToMongo;
