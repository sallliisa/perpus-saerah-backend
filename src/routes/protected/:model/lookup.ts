import { prisma } from "@/lib/db"
import { flattenObject, getModelConfig } from "@/utils/common"
import { Handler } from "express"
import { deepmerge } from "deepmerge-ts"

export const get: Handler = async (req, res) => {

    const config = await getModelConfig(req.params.model)

    const params = {
      page: 1,
      limit: 100000,
      search: '',
      sort: 'asc',
      ...req.query
    }
    
    const baseQuery = {
      take: Number(params.limit),
      skip: Number(params.page - 1)*Number(params.limit),
      orderBy: config.list?.orderBy ?? {id: params.sort.toLowerCase()}
    }

    const relationQuery = config.relation ? {
      include: {
        ...config.relation
      },
    } : {}

    const searchFilterQuery = config.list?.searchable?.length && params.search ? {
      where: {
        OR: config.list.searchable.map((item: string) => ({[item]: {contains: params.search}}))
      }
    } : {}

    const count = await (prisma[(req.params.model as any)] as any).count()
    const result = await (prisma[(req.params.model as any)] as any).findMany(deepmerge(baseQuery, {...relationQuery, ...searchFilterQuery}))

    res.send({
      total: count,
      totalPage: Math.ceil(count / params.limit),
      data: result.map((item: Record<string, any>) => flattenObject(item))
    })
}