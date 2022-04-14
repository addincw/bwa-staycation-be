import express from "express";
import { index } from "../controllers/master/place";

const router = express.Router();

router.get("/", index);

export default router;
