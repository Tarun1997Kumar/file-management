import mongoose, { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI || "", clientOptions)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error: ", error));
};

export default connectDb;
