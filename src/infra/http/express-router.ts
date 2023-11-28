import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body })
    httpResponse.statusCode == 200
      ? res.status(200).json(httpResponse.data)
      : res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
  }
}
