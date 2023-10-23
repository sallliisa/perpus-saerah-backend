import { prisma } from "../../../lib/db"
import configs from "../../../configs"
import { flattenObject } from "../../../utils/common"
import { Handler } from "express"

export const get: Handler = async (req, res) => {
  let result = await (prisma[(req.params.model as any)] as any).findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      ...configs[req.params.model]?.relation ? Object.fromEntries(Object.keys(configs[req.params.model].relation).map(key => [key, {select: configs[req.params.model].relation[key].reduce((obj: Record<string, any>, item: string) => Object.assign(obj, {[item]: true}), {})}])): {},
      ...configs[req.params.model]?.query?.show?.include
    }
  })
  if (configs[req.params.model]?.show?.afterExecute) {
    result = configs[req.params.model]?.show.afterExecute(result, req, res)
  }
  res.send({data: flattenObject(result)})
}