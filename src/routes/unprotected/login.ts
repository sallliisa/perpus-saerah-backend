import { prisma } from "@/lib/db"
import { Handler } from "express"

export const post: Handler = async (req, res) => {
  console.log(req.body)
  const result = await prisma.user.findFirst({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })

  if (!result) return res.status(403).send({error_message: 'Username atau password salah!'})

  let data
  if (result.type === 'member') data = await prisma.$queryRaw`SELECT member.*, user.name, user.email, user.type FROM member INNER JOIN user ON member.user_id=user.id WHERE user.email=${req.body.email} AND user.password=${req.body.password}`
  else data = await prisma.$queryRaw`SELECT officer.*, user.name, user.email, user.type FROM officer INNER JOIN user WHERE user.email=${req.body.email} AND user.password=${req.body.password}`
  data = (data as any)[0]

  res.send({
    data: {
      token: JSON.stringify(data),
      permissions: [],
      profile: data
    }
  })
}