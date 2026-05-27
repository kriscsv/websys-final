const express = require("express");
const router  = express.Router();
const { getAllReports, createReport } = require("../controllers/reportController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/",  verifyToken, getAllReports);
router.post("/", verifyToken, createReport);

module.exports = router;