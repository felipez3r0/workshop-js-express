import User from '../models/user.model.js'

export default class UserController{
  static async index(req, res) {
    const users = await User.findMany()
    res.json(users)
  }
  static async create(req, res) {
    const user = await User.create({
      data: req.body
    })
    res.json(user)
  }  
}