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
}