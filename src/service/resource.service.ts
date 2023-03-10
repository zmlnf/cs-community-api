import { AppDataSource } from "../app/database.js";
import { Resource } from "../entity/resource.entity.js";
import { StarResource } from "../entity/starResource.entity.js";

export async function createResourceService(resource: Pick<Resource, 'name' | 'link' | 'cover' | 'content'>) {
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  const result = await ResourceRepo.create({ ...resource })
  return await ResourceRepo.save(result)
}

export async function findResourceListService() {
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  const StarResourceRepo = await AppDataSource.getRepository(StarResource)
  const result = await ResourceRepo.findAndCount({ where: { isDelete: false } })
  return { ...result }
}

export async function findCategoryByIdService(id: number) {
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  return await ResourceRepo.findOne({ where: { id, isDelete: false } })
}

export async function deleteResourceService(id: number) {
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  return await ResourceRepo.update({ id }, { isDelete: true })
}

export async function getResourceInfoByIdService(id: number) {
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  const data = await ResourceRepo.findOne({ where: { id, isDelete: false } })
  if (data) {
    await ResourceRepo.update({ id }, { views: data?.views + 1 })
  }
  return await ResourceRepo.findOne({ where: { id, isDelete: false } })
}

// TODO: refactor
export async function starResourceService(userId: number, resourceId: number) {
  const StarResourceRepo = await AppDataSource.getRepository(StarResource)
  const ResourceRepo = await AppDataSource.getRepository(Resource)
  const isExist = await StarResourceRepo.findOne({ where: { userId, resourceId } })
  let result
  if (!isExist) {
    result = await StarResourceRepo.create({ userId, resourceId })
    await StarResourceRepo.save(result)
    await ResourceRepo.update({ id: resourceId }, { stars: 1 })
    const data = await ResourceRepo.findOne({ where: { isDelete: false } })
    return [data, '????????????']
  }
  await StarResourceRepo.update({ id: isExist.id }, { isDelete: !isExist.isDelete })
  const data = await ResourceRepo.findOne({ where: { isDelete: false } }) as Resource
  // ????????????
  if (!isExist.isDelete) {
    await ResourceRepo.update({ id: resourceId }, { stars: data.stars - 1 })
  } else {
    // ?????????????????????
    await ResourceRepo.update({ id: resourceId }, { stars: data.stars + 1 })
  }
  const resultMsg = !isExist.isDelete ? '????????????' : '????????????'
  const newData = await ResourceRepo.findOne({ where: { isDelete: false } })
  return [newData, resultMsg]
}
