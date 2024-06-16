import mongoose from "mongoose";


export const connectDB = () => mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Ecommerce",
  })
  .then(() => {
    console.log("successfully connected to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });