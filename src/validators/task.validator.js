import { body } from 'express-validator'

export const createTaskValidator = [
  body('title').isString().withMessage("Título inválido"),
  body('userId').isInt().withMessage("ID do usuário inválido"),
]