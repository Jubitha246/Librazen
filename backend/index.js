import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import categoryRoute from './route/category.route.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(error => {
  console.log("Error:", error);
});
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
// Defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
