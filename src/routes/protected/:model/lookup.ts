import { Handler } from "express"
import { prisma } from "@/lib/db"

export const get: Handler = async (req, res) => {
    const params = {
        page: 1,
        limit: 100000,
        ...req.query
    }
    const result = await (prisma[(req.params.model as any)] as any).findMany({
        take: Number(params.limit),
        skip: Number(params.page - 1)*Number(params.limit)
    })
    const count = await (prisma[(req.params.model as any)] as any).count()
    res.send({
        total: count,
        totalPage: Math.ceil(count / params.limit),
        data: result
    })
}