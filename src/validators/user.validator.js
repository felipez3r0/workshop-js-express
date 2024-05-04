import { body } from 'express-validator'

export const createUserValidator = [
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
]