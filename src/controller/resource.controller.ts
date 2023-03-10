import { Request, Response } from 'express'
import { Request as JwtRequest } from 'express-jwt'
import response from '../app/response.js'
import { getResourceInfoByIdService, createResourceService, deleteResourceService, findResourceListService, starResourceService } from '../service/resource.service.js'

export async function createResource(req: Request, res: Response) {
  const { name = '', link = '', cover = 'http://localhost:5000/xxx.jpg', content = '' } = req.body
  const result = await createResourceService({ name, link, cover, content })
  res.json(response.Success(result, '上传成功'))
}

export async function findResourceList(req: Request, res: Response) {
  const result = await findResourceListService()
  res.json(response.Success({ list: result[0], count: result[1] }))
}

export async function deleteResource(req: Request, res: Response) {
  const { id } = req.params
  const result = await deleteResourceService(parseInt(id))
  res.json(response.Success(result, '删除成功'))
}

export async function getResourceInfoById(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const result = await getResourceInfoByIdService(id)
  res.json(response.Success(result))
}

export async function starResource(req: JwtRequest, res: Response) {
  const resourceId = parseInt(req.params.id)
  const userId = req.auth?.id
  const [result, resultMsg] = await starResourceService(userId, resourceId)
  res.json(response.Success(result, resultMsg as string))
}
