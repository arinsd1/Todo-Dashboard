import express from 'express';
import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { taskValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect); // Protect all task routes

router.route('/')
    .get(getTasks)
    .post(taskValidation, validate, createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
    .get(getTask)
    .put(taskValidation, validate, updateTask)
    .delete(deleteTask);

export default router;
