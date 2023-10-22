import { Handler } from "express";
import { prisma } from "../../lib/db";

export const post: Handler = async (req, res) => {
  const result = await prisma.member.update({
    where: {
      id: Number(req.body.id)
    },
    data: {
      verified: true
    }
  })
  res.send(result)
}