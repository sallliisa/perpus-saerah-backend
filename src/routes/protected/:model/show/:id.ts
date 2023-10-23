import { prisma } from "@/lib/db"
import configs from "@/configs"
import { flattenObject } from "@/utils/common"
import { Handler } from "express"

export const get: Handler = async (req, res) => {
  let result = await (prisma[(req.params.model as any)] as any).findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      ...configs[req.params.model]?.relation
    }
  })
  if (configs[req.params.model]?.show?.afterExecute) {
    result = await configs[req.params.model]?.show.afterExecute(result, req, res)
  }
  res.send({data: flattenObject(result)})
}