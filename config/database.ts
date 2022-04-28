import * as express from "express";

import "dotenv/config";
import mongoose from "mongoose";

export const dbConnect = (): express.RequestHandler => {
  const { DB_HOST, DB_PORT, DB_NAME } = process.env;
  const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  return (req, res, next) => {
    mongoose.connect(uri, {}, (err) => {
      if (err) console.error("DB Connection: failed connect to DB..", err);
    });

    next();
  };
};
