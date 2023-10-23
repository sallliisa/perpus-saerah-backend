import { Handler } from "express"
import { prisma } from "@/lib/db"
import configs from "@/configs"

export const post: Handler = async (req, res) => {
    let payload = configs[req.params.model]?.create?.beforeExecute ? await configs[req.params.model]?.create?.beforeExecute(req, res) : req.body
    payload = configs[req.params.model]?.create?.fields ? Object.fromEntries(configs[req.params.model]?.create?.fields.map((key: string) => [key, payload[key]])) : payload
    let result = await (prisma[(req.params.model as any)] as any).create({
        data: payload
    })
    if (configs[req.params.model]?.create?.afterExecute) result = await configs[req.params.model]?.create?.afterExecute(result, req, res)
    res.send({data: result})
}