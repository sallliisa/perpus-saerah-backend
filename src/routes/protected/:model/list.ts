import { prisma } from "@/lib/db"
import { flattenObject, getModelConfig } from "@/utils/common"
import { Handler } from "express"
import { deepmerge } from "deepmerge-ts"

export const get: Handler = async (req, res) => {
  const config = await getModelConfig(req.params.model)

  const params: Record<string, any> = {
    page: 1,
    limit: 10,
    search: '',
    sort: 'asc',
    ...req.query
  }
  
  const baseQuery = {
    take: Number(params.limit),
    skip: Number(params.page - 1)*Number(params.limit),
    orderBy: config.list?.orderBy ?? {id: params.sort}
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

  const dataFilterQuery = config.list?.filterable?.length ? {
    where: {
      OR: config.list.filterable.map((item: any) => params[item]).filter((item: any) => item != null).length > 0 ? config.list.filterable.map((item: string) => {
        if (params[item]) return ({[item]: {equals: isNaN(params[item]) ? params[item] : Number(params[item])}})
      }).filter((item: any) => item != null) : undefined
    }
  } : {}

  
  let query = config.list?.queryGenerator ? deepmerge(deepmerge(baseQuery, {...relationQuery, ...deepmerge(searchFilterQuery, dataFilterQuery)}), (await config.list.queryGenerator(req, res, params)) ?? {}) : deepmerge(baseQuery, deepmerge({...relationQuery, ...deepmerge(searchFilterQuery, dataFilterQuery)}))
  console.log(req.params.model, deepmerge(baseQuery, {...relationQuery, ...deepmerge(searchFilterQuery, dataFilterQuery)}))
  
  if (config.list?.beforeExecute) query = await config.list.beforeExecute(query, req, res, params)

  const count = await (prisma[(req.params.model as any)] as any).count()
  let result = (await (prisma[(req.params.model as any)] as any).findMany(query)).map((item: Record<string, any>) => flattenObject(item))

  if (config.show?.afterExecute) {
    result = await config.list.afterExecute(result, req, res)
  }

  res.send({
    total: count,
    totalPage: Math.ceil(count / params.limit),
    data: result
  })
}