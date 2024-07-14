import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from './model/user.model.js';

dotenv.config();

const createAdminUser = async () => {
  await mongoose.connect(process.env.MongoDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'admin@example.com';
  const existingAdmin = await User.findOne({ email });

  if (!existingAdmin) {
    const hashPassword = await bcryptjs.hash('adminpassword', 10);
    const adminUser = new User({
      fullname: 'Admin User',
      email,
      password: hashPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  mongoose.connection.close();
};

createAdminUser().catch((error) => console.log(error));
