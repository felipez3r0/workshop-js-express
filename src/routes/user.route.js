import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { createUserValidator, updateUserValidator, deleteUserValidator, loginValidator } from '../validators/user.validator.js'

const router = Router()

router.get('/', UserController.index)
router.post('/', createUserValidator, UserController.create)
router.get('/:id', UserController.show)
router.put('/:id', updateUserValidator, UserController.update)
router.delete('/:id', deleteUserValidator, UserController.delete)
router.post('/login', loginValidator, UserController.login)

export default router