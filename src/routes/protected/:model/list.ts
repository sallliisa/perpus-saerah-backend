import { prisma } from "@/lib/db"
import configs from "@/configs"
import { flattenObject } from "@/utils/common"
import { Handler } from "express"
import { deepmerge } from "deepmerge-ts"

export const get: Handler = async (req, res) => {
    const params = {
      page: 1,
      limit: 10,
      search: '',
      ...req.query
    }
    
    const baseQuery = {
      take: Number(params.limit),
      skip: Number(params.page - 1)*Number(params.limit),
    }

    const relationQuery = configs[req.params.model]?.relation ? {
      include: {
        ...configs[req.params.model]?.relation
      },
    } : {}

    const searchFilterQuery = configs[req.params.model]?.list?.searchable?.length && params.search ? {
      where: {
        OR: configs[req.params.model].list.searchable.map((item: string) => ({[item]: {contains: params.search}}))
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