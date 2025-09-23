import mongoose from "mongoose";

export default async function connectToDb() {
  try {
    const connectInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\n MongoDb connected !! DB host : ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDb Connection error !!", error);
    process.exit(1);
  }
}
