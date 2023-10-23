import { prisma } from "../../lib/db"
import configs from "../../configs"
import { flattenObject } from "../../utils/common"
import { Handler } from "express"

export const get: Handler = async (req, res) => {
    const params = {
      page: 1,
      limit: 10,
      ...req.query
    }
    const count = await (prisma[(req.params.model as any)] as any).count()
    const result = await (prisma[(req.params.model as any)] as any).findMany({
      take: Number(params.limit),
      skip: Number(params.page - 1)*Number(params.limit),
      include: {
        ...configs[req.params.model]?.relation ? Object.fromEntries(Object.keys(configs[req.params.model].relation).map(key => [key, {select: configs[req.params.model].relation[key].reduce((obj: Record<string, any>, item: string) => Object.assign(obj, {[item]: true}), {})}])): {},
        ...configs[req.params.model]?.query?.list?.include
      }
    })
    res.send({
      total: count,
      totalPage: Math.ceil(count / params.limit),
      data: result.map((item: Record<string, any>) => flattenObject(item))
    })
}