import * as express from "express";

import "dotenv/config";
import mongoose from "mongoose";

export const dbConnect = (): express.RequestHandler => {
  return (req, res, next) => {
    const { DB_HOST, DB_PORT, DB_NAME } = process.env;
    mongoose.connect(
      `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      {},
      (err) => {
        if (err) console.error("DB Connection: failed connect to DB..", err);
      }
    );

    next();
  };
};
