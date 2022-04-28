import express, { Request, Response, NextFunction } from "express";

import bankRoutes from "./bank";
import categoryRoutes from "./CategoryRoute";
import placeRoutes from "./place";
import userRoutes from "./users";

export const routes = (app: express.Application) => {
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.render("index", { pageTitle: "Express" });
  });

  app.use("/master/bank", bankRoutes);
  app.use("/master/category", categoryRoutes);
  app.use("/master/place", placeRoutes);
  app.use("/users", userRoutes);
};

export default routes;
