import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { createUserValidator } from '../validators/user.validator.js'

const router = Router()

router.get('/', UserController.index)
router.post('/', createUserValidator, UserController.create)
router.get('/:id', UserController.show)

export default router