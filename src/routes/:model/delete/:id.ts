import { prisma } from "../../../lib/db"

export const del: Handler = async (req, res) => {
  const result = await (prisma[(req.params.model as any)] as any).delete({
    where: {
      id: Number(req.params.id)
    }
  })
  res.send({data: result})
}