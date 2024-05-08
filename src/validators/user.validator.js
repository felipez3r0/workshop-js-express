import { body, param } from 'express-validator'

export const createUserValidator = [
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const updateUserValidator = [
  param('id').isInt().withMessage("ID inválido"),
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const deleteUserValidator = [
  param('id').isInt().withMessage("ID inválido"),
]