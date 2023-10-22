import { prisma } from "../../../utils/db"

export const get: Handler = async (req, res) => {
    const result = await (prisma[(req.params.model as any)] as any).findUnique({
        where: {
            id: Number(req.params.id)
        }
    })
    res.send({data: result})
}