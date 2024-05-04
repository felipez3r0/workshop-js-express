import User from '../models/user.model.js'
import { validationResult } from 'express-validator'

export default class UserController{
  static async index(req, res) {
    const users = await User.findMany()
    res.json(users)
  }
  
  static async create(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const user = await User.create({
      data: req.body
    })
    res.json(user)
  } 

  static async show(req, res) {
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.json(user)
  }
  
  static async update(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }    
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    const updatedUser = await User.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: req.body
    })
    res.json(updatedUser)
  }
  
  static async delete(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }    
    const user = await User.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    await User.delete({
      where: {
        id: parseInt(req.params.id)
      }
    })
    res.status(204).json({ message: 'Usuário deletado com sucesso' })
  }  
}