const express = require('express');
const TaskController = require('../controllers/taskController');

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Adds a task with a title and optional description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete Swagger Documentation"
 *               description:
 *                 type: string
 *                 example: "Write API docs for the backend"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', TaskController.createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve the latest 5 uncompleted tasks
 *     description: Returns a list of tasks that are not marked as completed.
 *     responses:
 *       200:
 *         description: A list of tasks
 */
router.get('/', TaskController.getTasks);

/**
 * @swagger
 * /tasks/{id}/done:
 *   patch:
 *     summary: Mark a task as completed
 *     description: Updates a task's status to completed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Task marked as completed
 *       404:
 *         description: Task not found
 */
router.patch('/:id/done', TaskController.markTaskAsDone);
  

router.patch("/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await TaskModel.updateTaskStatus(id, status);
      res.json({ message: "Task status updated" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  

module.exports = router;
