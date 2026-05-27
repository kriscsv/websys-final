const db = require("../config/db");

exports.getAllReports = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reports ORDER BY generated_at DESC");
    const mapped = rows.map(r => ({
      id:          r.id,
      title:       r.title,
      college:     r.college,
      year:        r.year,
      category:    r.category,
      generatedAt: r.generated_at,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { college, year, category } = req.body;
    if (!year) return res.status(400).json({ message: "Year is required" });

    const parts = [year, college, category].filter(Boolean);
    const title = `Report — ${parts.join(" · ")}`;

    const [result] = await db.query(
      "INSERT INTO reports (title, college, year, category, generated_by) VALUES (?, ?, ?, ?, ?)",
      [title, college || null, year, category || null, req.user?.id || null]
    );

    res.status(201).json({
      id:          result.insertId,
      title,
      college:     college || null,
      year,
      category:    category || null,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};