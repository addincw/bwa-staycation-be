import express from "express";

import bankRoutes from "./bank";
import categoryRoutes from "./category";
import placeRoutes from "./place";
import userRoutes from "./users";

const router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { pageTitle: "Express" });
});

export const routes = (app: any) => {
  app.use("/", router);
  app.use("/master/bank", bankRoutes);
  app.use("/master/category", categoryRoutes);
  app.use("/master/place", placeRoutes);
  app.use("/users", userRoutes);
};

export default routes;
