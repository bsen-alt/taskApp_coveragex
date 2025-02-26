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
      const task = await TaskModel.createTask(validatedData.title, validatedData.description);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getTasks(req, res) {
    try {
      const { search } = req.query;
      console.log("🔍 Search Query Received:", search); // Debugging log
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
      await TaskModel.deleteTask(id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async unHoldTask(req, res) {
    try {
      const { id } = req.params;
      await TaskModel.unHoldTask(id);
      res.json({ message: 'Task unheld and moved to To-Do' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
  
  
  
};

module.exports = TaskController;
