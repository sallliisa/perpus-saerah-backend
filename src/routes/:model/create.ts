import { prisma } from "../../utils/db"

export const post: Handler = async (req, res) => {
    const result = await (prisma[(req.params.model as any)] as any).create({
        data: req.body
    })
    res.send({data: result})
}