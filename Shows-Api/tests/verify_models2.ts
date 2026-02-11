import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import User from '../models/User';

// 1. Explicitly point to the .env file (assuming it's in the root of Shows-Api)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runVerification = async () => {
  console.log("🔍 STARTING MODEL VERIFICATION...");

  // DEBUG CHECK (Safe)
  const user = process.env.DbUser;
  const pass = process.env.DbString;

  if (!user || !pass) {
      console.error("❌ CRITICAL ERROR: Environment variables are missing!");
      console.log(`   DbUser found: ${!!user} (Value: ${user})`);
      console.log(`   DbString found: ${!!pass} (Value: ${pass ? '******' : 'undefined'})`);
      console.log("   Make sure your .env file is in the 'Shows-Api' root folder.");
      process.exit(1);
  }

  // 2. Connect to DB
  const uri = `mongodb+srv://${user}:${pass}@cluster0-shows-app.ljiuw6y.mongodb.net/TesttDatabase?retryWrites=true&w=majority`;

  try {
    console.log("🔌 Attempting connection...");
    await mongoose.connect(uri);
    console.log("✅ Database Connected Successfully!");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
    process.exit(1);
  }

  // 3. Test the USER Model
  try {
    console.log("👉 Testing USER creation...");
    const newUser = new User({
      email: `verify_${Date.now()}@test.com`,
      password: "testpassword123",
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

  await mongoose.disconnect();
  console.log("🏁 VERIFICATION COMPLETE.");
};

runVerification();
