import { Handler } from "express"
import { prisma } from "../../lib/db"
import configs from "../../configs"

export const post: Handler = async (req, res) => {
    let result = await (prisma[(req.params.model as any)] as any).create({
        data: req.body
    })
    if (configs[req.params.model]?.create?.afterExecute) {
        result = configs[req.params.model]?.create?.afterExecute(result, req, res)
    }
    res.send({data: result})
}