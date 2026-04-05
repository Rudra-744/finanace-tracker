import express from "express";
import { createRecord, getRecords, updateRecord, deleteRecord } from "../controller/record.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect); 

router.route("/")
    .get(getRecords)
    .post(restrictTo("admin"), createRecord);

router.route("/:id")
    .patch(restrictTo("admin"), updateRecord)
    .delete(restrictTo("admin"), deleteRecord);

export default router;
