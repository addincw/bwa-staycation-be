import express from "express";
import {
  index,
  store,
  showFormCreate,
  showFormEdit,
  update,
  destroy,
} from "../controllers/master/CategoryController";

const router = express.Router();

router.get("/", index);
router.post("/", store);
router.put("/", update);
router.delete("/:id", destroy);
router.get("/_form", showFormCreate);
router.get("/_form/:id", showFormEdit);

export default router;
