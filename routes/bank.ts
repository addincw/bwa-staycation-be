import express from "express";
import { index } from "../controllers/master/bank";

const router = express.Router();

router.get("/", index);

export default router;
