import { prisma } from "@/lib/db"
import { flattenObject, getModelConfig } from "@/utils/common"
import { Handler } from "express"

export const get: Handler = async (req, res) => {

  const config = await getModelConfig(req.params.model)

  let result = await (prisma[(req.params.model as any)] as any).findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      ...config.relation
    }
  })
  if (config.show?.afterExecute) {
    result = await config.show.afterExecute(result, req, res)
  }
  res.send({data: flattenObject(result)})
}