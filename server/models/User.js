const db = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, college, department, year, bloc, role FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  create: async ({ fullName, email, password, college, department, year, bloc }) => {
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password, college, department, year, bloc) VALUES (?,?,?,?,?,?,?)',
      [fullName, email, password, college, department, year, bloc]
    );
    return result.insertId;
  },
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, college, department, year, bloc, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

module.exports = User;