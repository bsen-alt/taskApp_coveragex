const pool = require('../config/db');

const TaskModel = {
  async createTask(title, description) {
    const [result] = await pool.query(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    return { id: result.insertId, title, description };
  },

  async getLatestTasks() {
    const [rows] = await pool.query(
      'SELECT * FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5'
    );
    return rows;
  },

  async markTaskAsDone(id) {
    await pool.query('UPDATE task SET is_completed = TRUE WHERE id = ?', [id]);
    return { message: 'Task marked as done' };
  }
};

module.exports = TaskModel;
