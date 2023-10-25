import { Handler } from "express"
import { prisma } from "@/lib/db"
import { getModelConfig } from "@/utils/common"

export const post: Handler = async (req, res) => {
  const config = await getModelConfig(req.params.model)
  if (config.create?.validator) {
    console.log('gamer validator create')
    try {
      await config.create.validator(req, res)
    } catch (err) {
      res.status(500).send({error_message: err.message})
      return
    }
  }
  let payload = config.create?.beforeExecute ? await config.create?.beforeExecute(req, res) : req.body
  payload = config.create?.fields ? Object.fromEntries(config.create?.fields.map((key: string) => [key, payload[key]])) : payload
  let result = await (prisma[(req.params.model as any)] as any).create({
    data: payload
  })
  if (config.create?.afterExecute) result = await config.create?.afterExecute(result, req, res)
  res.send({data: {}})
}