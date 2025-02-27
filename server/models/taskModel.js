const pool = require('../config/db');

const TaskModel = {
  async getTaskById(id) {
    const [rows] = await pool.query('SELECT * FROM task WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  },

  async createTask(title, description,status_id = 1) {
    const [result] = await pool.query(
      'INSERT INTO task (title, description,status_id) VALUES (?, ?)',
      [title, description]
    );
    return { id: result.insertId, title, description, status_id };
  },

  async markTaskAsDone(id) {
    await pool.query('UPDATE task SET status_id = 3 WHERE id = ?', [id]);
    return { message: 'Task marked as done' };
  },

  async getTasks(search = '') {
    const query = search
      ? `SELECT task.*, task_status.status_name 
         FROM task 
         JOIN task_status ON task.status_id = task_status.id
         WHERE title LIKE ? 
         ORDER BY created_at DESC`
      : `SELECT task.*, task_status.status_name 
         FROM task
         JOIN task_status ON task.status_id = task_status.id
         ORDER BY created_at DESC`;
    const [rows] = await pool.query(query, [`%${search}%`]);
    return rows;
  },
  
  async updateTaskStatus(id, status) {
    await pool.query(
      "UPDATE task SET status_id = (SELECT id FROM task_status WHERE status_name = ?) WHERE id = ?",
      [status, id]
    );
  },
  
  async updateTask(id, title, description) {
    await pool.query(
      'UPDATE task SET title = ?, description = ? WHERE id = ? AND status_id IN (1, 2)', // 1 for todo, 2 for hold
      [title, description, id]
    );
    return { message: 'Task updated' };
  },

  async deleteTask(id) {
    const [result] = await pool.query(
      'DELETE FROM task WHERE id = ? AND status_id IN (1, 2)', // only todo and hold tasks
      [id]
    );
  
    if (result.affectedRows === 0) {
      throw new Error(`Task ID ${id} not found or cannot be deleted`);
    }
  
    return { message: 'Task deleted' };
  },
  
  async updateTaskStatus(id, status_id) {
    await pool.query(
      "UPDATE task SET status_id = ? WHERE id = ?",
      [status_id, id]
    );
    return { message: 'Task status updated successfully' };
  },
};

module.exports = TaskModel;
