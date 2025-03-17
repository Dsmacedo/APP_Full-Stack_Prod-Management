import mongoose from "mongoose";

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/admin";
  const dbName = process.env.DB_NAME || "teste";

  try {
    const connection = await mongoose.connect(mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
    });

    cachedDb = connection.connection;
    console.log("Connected to MongoDB");
    return cachedDb;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cachedDb) {
    await mongoose.disconnect();
    cachedDb = null;
    console.log("Disconnected from MongoDB");
  }
}
