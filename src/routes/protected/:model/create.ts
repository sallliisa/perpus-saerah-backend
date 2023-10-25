import { Handler } from "express"
import { prisma } from "@/lib/db"
import { getModelConfig } from "@/utils/common"

export const post: Handler = async (req, res) => {

    const config = await getModelConfig(req.params.model)

    let payload = config.create?.beforeExecute ? await config.create?.beforeExecute(req, res) : req.body
    payload = config.create?.fields ? Object.fromEntries(config.create?.fields.map((key: string) => [key, payload[key]])) : payload
    let result = await (prisma[(req.params.model as any)] as any).create({
        data: payload
    })
    if (config.create?.afterExecute) result = await config.create?.afterExecute(result, req, res)
    res.send({data: result})
}