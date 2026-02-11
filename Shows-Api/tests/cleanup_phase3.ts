import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

(async () => {
  const uri = `mongodb+srv://${process.env.DbUser}:${process.env.DbString}@cluster0-shows-app.ljiuw6y.mongodb.net/TesttDatabase?retryWrites=true&w=majority`;
  await mongoose.connect(uri);
  const result = await mongoose.connection.db!.collection('users').deleteOne({ email: 'phase3_test@test.com' });
  console.log('Cleanup result:', result);
  await mongoose.disconnect();
})();
