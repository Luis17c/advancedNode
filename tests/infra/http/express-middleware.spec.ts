/* eslint-disable @typescript-eslint/await-thenable */
import { HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NextFunction, Request, Response, RequestHandler } from 'express'
import { MockProxy, mock } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  await middleware.handle({ ...req.headers })
}

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
    sut = adaptExpressMiddleware(middleware)
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const req = getMockReq({ headers: { } })
    const res = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
