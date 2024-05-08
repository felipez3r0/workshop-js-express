import { Router } from 'express'
import TaskController from '../controllers/task.controller.js'
import { createTaskValidator } from '../validators/task.validator.js'

const router = Router()

router.get('/', TaskController.index)
router.post('/', createTaskValidator, TaskController.create)

export default router