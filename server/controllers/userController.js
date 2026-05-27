const db = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, college, department, year, bloc, role, created_at FROM users ORDER BY created_at DESC"
    );
    const mapped = rows.map(u => ({
      id:       u.id,
      fullName: u.full_name,
      email:    u.email,
      college:  u.college,
      role:     u.role,
      active:   true,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};