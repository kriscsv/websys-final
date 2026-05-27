const db = require("../config/db");

exports.getAllDocuments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM documents ORDER BY created_at DESC");
    const mapped = rows.map(d => ({
      id:           d.id,
      title:        d.title,
      category:     d.category,
      college:      d.college,
      department:   d.department,
      fileSize:     d.file_size,
      filePath:     d.file_path,
      fileName:     d.file_name,
      status:       d.status,
      uploadedAt:   d.created_at,
      uploaderName: d.uploader_name,
      uploaderId:   d.uploaded_by,
      uploaderRole: d.uploader_role,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyDocuments = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM documents WHERE uploaded_by = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    const mapped = rows.map(d => ({
      id:           d.id,
      title:        d.title,
      category:     d.category,
      college:      d.college,
      department:   d.department,
      fileSize:     d.file_size,
      filePath:     d.file_path,
      fileName:     d.file_name,
      status:       d.status,
      uploadedAt:   d.created_at,
      uploaderName: d.uploader_name,
      uploaderId:   d.uploaded_by,
      uploaderRole: d.uploader_role,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { title, category } = req.body;
    const file = req.file;

    if (!file || !title || !category)
      return res.status(400).json({ message: "Missing fields" });

    const fileSize     = (file.size / 1024).toFixed(0) + " KB";
    const uploaderName = req.user.fullName || req.user.full_name || req.user.email;
    const college      = req.user.college  || null;
    const department   = req.user.course   || req.user.department || null;

    const [result] = await db.query(
      `INSERT INTO documents 
        (title, category, college, department, file_name, file_path, file_size, uploaded_by, uploader_name, uploader_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, college, department, file.originalname, file.path, fileSize, req.user.id, uploaderName, req.user.role || "student"]
    );

    res.status(201).json({
      id:            result.insertId,
      title,
      category,
      file_size:     fileSize,
      status:        "Pending",
      uploader_name: uploaderName,
      created_at:    new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Approved", "Rejected", "Pending"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    await db.query(
      "UPDATE documents SET status = ? WHERE id = ?",
      [status, id]
    );
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    await db.query("DELETE FROM documents WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};