import { Handler } from "express"
import { prisma } from "@/lib/db"

export const patch: Handler = async (req, res) => {
    const result = await (prisma[(req.params.model as any)] as any).update({
        where: {
            id: req.body.id
        },
        data: {
            ...req.body,
            id: undefined,
            updated_at: new Date()
        }
    })
    res.send({data: result})
}