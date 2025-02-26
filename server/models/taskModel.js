const pool = require('../config/db');

const TaskModel = {
  async createTask(title, description) {
    const [result] = await pool.query(
      'INSERT INTO task (title, description) VALUES (?, ?)',
      [title, description]
    );
    return { id: result.insertId, title, description };
  },

  // async getLatestTasks() {
  //   const [rows] = await pool.query(
  //     'SELECT * FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5'
  //   );
  //   return rows;
  // },

  async markTaskAsDone(id) {
    await pool.query('UPDATE task SET status_id = 3 WHERE id = ?', [id]);
    return { message: 'Task marked as done' };
  },

  async getTasks(search = '', showCompleted = false) {
    const query = search
      ? `SELECT task.*, task_status.status_name 
         FROM task 
         JOIN task_status ON task.status_id = task_status.id
         WHERE title LIKE ? AND status_name ${showCompleted ? "=" : "!="} 'completed'
         ORDER BY created_at DESC LIMIT 5`
      : `SELECT task.*, task_status.status_name 
         FROM task
         JOIN task_status ON task.status_id = task_status.id
         WHERE status_name ${showCompleted ? "=" : "!="} 'completed'
         ORDER BY created_at DESC LIMIT 5`;
  
    const [rows] = await pool.query(query, [`%${search}%`]);
    return rows;
  },


  async updateTaskStatus(id, status) {
    await pool.query(
      "UPDATE task SET status_id = (SELECT id FROM task_status WHERE status_name = ?) WHERE id = ?",
      [status, id]
    );
  }
  
  
};

module.exports = TaskModel;
