import { Router } from 'express'
import TaskController from '../controllers/task.controller.js'
import { createTaskValidator } from '../validators/task.validator.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authMiddleware, TaskController.index)
router.post('/', createTaskValidator, TaskController.create)

export default router