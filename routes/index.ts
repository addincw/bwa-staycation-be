import express, { Request, Response, NextFunction } from "express";

import * as web from "./web";

const router = express.Router();

const routes = () => {
  web.bind(router);

  return router;
};

export default routes;
