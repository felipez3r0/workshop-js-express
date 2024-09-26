import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import * as jose from 'jose'

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
    const password = await bcrypt.hash(req.body.password, 10) // Gera a senha criptografada com salt 10
    const user = await User.create({
      data: {
        ...req.body,
        password
      }
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

  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } 

    const { email, password } = req.body
    const user = await User.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha inválida' })
    }

    // Gera o token JWT
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name
    })
    .setIssuedAt()
    .setExpirationTime('1d') // 1 dia
    .setProtectedHeader({ alg: 'HS256' }) // algorithm
    .sign(secretKey)

    res.json({ message: 'Usuário logado com sucesso!', token })
  }
}