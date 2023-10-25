import { Handler } from "express"
import { prisma } from "@/lib/db"
import { getModelConfig } from "@/utils/common"

export const patch: Handler = async (req, res) => {
  const config = await getModelConfig(req.params.model)
  if (config.update?.validator) {
    try {
      await config.update.validator(req, res)
    } catch (err) {
      res.status(500).send(err)
    }
  }
  let payload = config.update?.beforeExecute ? await config.update?.beforeExecute(req, res) : req.body
  payload = config.update?.fields ? Object.fromEntries(config.update?.fields.map((key: string) => [key, payload[key]])) : payload
  delete payload.id
  let result = await (prisma[(req.params.model as any)] as any).update({
    where: {
      id: req.body.id
    },
    data: {
      ...payload,
      updated_at: new Date()
    }
  })
  if (config.update?.afterExecute) result = await config.update?.afterExecute(result, req, res)
  res.send({data: {}})
}