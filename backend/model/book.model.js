import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
   },
   issuedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  availableCopies:{type:Number,default:1},
  borrowedBy:[{
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    dueDate:{type:Date,required:true}
  }]
});
const Book = mongoose.model('Book', bookSchema);

export default Book;
