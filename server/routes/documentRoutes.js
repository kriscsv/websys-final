const express    = require("express");
const router     = express.Router();
const multer     = require("multer");
const { getAllDocuments, getMyDocuments, uploadDocument, updateDocumentStatus, deleteDocument, downloadDocument } = require("../controllers/documentController");
const { verifyToken } = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" });

router.get("/",           verifyToken, getAllDocuments);
router.get("/mine",       verifyToken, getMyDocuments);
router.post("/",          verifyToken, upload.single("file"), uploadDocument);
router.get("/:id/download", verifyToken, downloadDocument);
router.patch("/:id",      verifyToken, updateDocumentStatus);
router.delete("/:id",     verifyToken, deleteDocument);

module.exports = router;