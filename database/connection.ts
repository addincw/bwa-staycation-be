import "dotenv/config";
import mongoose from "mongoose";

export const dbConnect = () => {
  const { DB_HOST, DB_PORT, DB_NAME } = process.env;
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {}, (err) => {
    if (err) console.error("DB Connection: failed connect to DB..", err);
  });
};
