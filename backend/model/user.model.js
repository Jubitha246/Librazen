import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Ensure this field is present
  borrowedBooks:[{
    book:{type:mongoose.Schema.Types.ObjectId,ref:'Book'},
    dueDate:{type:Date,required:true}
  }]
});

export default mongoose.model('User', UserSchema);
