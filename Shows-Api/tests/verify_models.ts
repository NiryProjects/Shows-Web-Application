import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config();

const runVerification = async () => {
  console.log("🔍 STARTING MODEL VERIFICATION...");

  // 1. Connect to DB
  // Fixed typo: TesttDatabase -> TestDatabase
  const uri = `mongodb+srv://${process.env.DbUser}:${process.env.DbString}@cluster0-shows-app.ljiuw6y.mongodb.net/TestDatabase?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log("✅ Database Connected.");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  }

  // 2. Test the USER Model
  const testEmail = `verify_${Date.now()}@test.com`;
  try {
    console.log("👉 Testing USER creation (with hashing)...");
    const hashedPassword = await bcrypt.hash("testpassword123", 10);

    const newUser = new User({
      email: testEmail,
      password: hashedPassword,
      username: `user_${Date.now()}`
    });

    const savedUser = await newUser.save();
    console.log(`✅ User Created: ID ${savedUser._id}`);

    // Clean up
    await User.findByIdAndDelete(savedUser._id);
    console.log("✅ User Deleted (Cleanup successful).");

  } catch (err) {
    console.error("❌ User Model Failed:", err);
  }

  // 3. Test the SHOW Model (Optional - if you converted it)
  // You can uncomment this block if Show.ts exists
  /*
  try {
    console.log("👉 Testing SHOW creation...");
    const newShow = new Show({
       title: "Test Show TS",
       description: "Testing TypeScript Models",
       // Add other required fields based on your schema
    });
    // await newShow.save();
    // console.log("✅ Show Created");
    // await Show.findByIdAndDelete(newShow._id);
  } catch (err) {
    console.error("❌ Show Model Failed:", err);
  }
  */

  await mongoose.disconnect();
  console.log("🏁 VERIFICATION COMPLETE.");
};

runVerification();
