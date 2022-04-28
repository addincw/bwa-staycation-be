import express from "express";

import * as CategoryController from "../controllers/master/CategoryController";

export const bind = (router: express.Router) => {
  // master/bank
  router.get("/master/bank", CategoryController.index);

  // master/category
  router.get("/master/category", CategoryController.index);
  router.post("/master/category", CategoryController.store);
  router.put("/master/category", CategoryController.update);
  router.delete("/master/category/:id", CategoryController.destroy);
  router.get("/master/category/_form", CategoryController.showFormCreate);
  router.get("/master/category/_form/:id", CategoryController.showFormEdit);

  // master/place
  router.get("/master/place", CategoryController.index);
};
