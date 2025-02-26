const pool = require('../config/db');

const TaskModel = {
  async createTask(title, description) {
    const [result] = await pool.query(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    return { id: result.insertId, title, description };
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
      'UPDATE task SET title = ?, description = ? WHERE id = ? AND status_id IN (1, 2)', // 1 is To-Do, 2 is Hold
      [title, description, id]
    );
    return { message: 'Task updated' };
  },

  async deleteTask(id) {
    await pool.query(
      'DELETE FROM task WHERE id = ? AND status_id IN (1, 2)', // 1 is To-Do, 2 is Hold
      [id]
    );
    return { message: 'Task deleted' };
  },

  async unHoldTask(id) {
    await pool.query('UPDATE task SET status_id = 1 WHERE id = ? AND status_id = 2', [id]); // 1 is To-Do, 2 is Hold
    return { message: 'Task unheld and moved to To-Do' };
  }
  
  
  
  
};

module.exports = TaskModel;
