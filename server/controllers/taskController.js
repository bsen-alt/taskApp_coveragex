const TaskModel = require('../models/taskModel');
const { z } = require('zod');

// Define input validation schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional()
});

const TaskController = {
  async createTask(req, res) {
    try {
      // Validate input data
      const validatedData = taskSchema.parse(req.body);
      const statusId = validatedData.status_id || 1;
      const task = await TaskModel.createTask(validatedData.title, validatedData.description, statusId);
      res.status(201).json(task);
    } catch (error) {
      console.error("Validation error:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async getTasks(req, res) {
    try {
      const { search } = req.query;
      const tasks = await TaskModel.getTasks(search);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async markTaskAsDone(req, res) {
    try {
      await TaskModel.markTaskAsDone(req.params.id);
      res.json({ message: 'Task marked as done' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      await TaskModel.updateTask(id, title, description);
      res.json({ message: 'Task updated' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
  
      const task = await TaskModel.getTaskById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      await TaskModel.deleteTask(id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  async updateTaskStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Task ID is missing" });
      }

      await TaskModel.updateTaskStatus(id, status_id);
      res.json({ message: "Task status updated successfully" });

    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  
  
  
  
};

module.exports = TaskController;
