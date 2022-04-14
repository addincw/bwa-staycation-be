import express from "express";
import { index } from "../controllers/master/category";

const router = express.Router();

router.get("/", index);

export default router;
