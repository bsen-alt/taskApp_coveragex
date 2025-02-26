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

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates a task's title and description.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', TaskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes the task with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', TaskController.deleteTask);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     description: Updates the status of a task (e.g., move to Hold or back to To-Do).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 */
router.patch('/:id/status', TaskController.updateTaskStatus);

module.exports = router;
