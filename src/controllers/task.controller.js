import Task from '../models/task.model.js'

export default class TaskController{
  static async index(req, res) {
    /* #swagger.security = [{
        "bearerAuth": []
    }] */    
    const tasks = await Task.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
    res.json(tasks)
  }
  static async create(req, res) {
    const task = await Task.create({
      data: req.body
    })
    res.json(task)
  }
}