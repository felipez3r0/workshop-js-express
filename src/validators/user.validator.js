import { body, param } from 'express-validator'

export const createUserValidator = [
  /*  #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      $ref: "#/components/schemas/AddOrUpdateUser"
                  }  
              }
          }
      } 
  */  
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const updateUserValidator = [
  /*
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'integer'
    }
    
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/AddOrUpdateUser"
          }  
        }
      }
    }
  */
  param('id').isInt().withMessage("ID inválido"),
  body('email').isEmail().withMessage("Email inválido"),
  body('name').isString().withMessage("Nome inválido"),
  body('age').isInt().withMessage("Idade inválida").optional(),
]

export const deleteUserValidator = [
  /*
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do usuário',
      required: true,
      type: 'integer'
    }
  */
  param('id').isInt().withMessage("ID inválido"),
]