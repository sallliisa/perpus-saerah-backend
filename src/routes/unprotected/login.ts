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

  console.log(result)

  if (!result) return res.status(403).send({error_message: 'Username atau password salah!'})

  let data
  if (result.type === 'member') data = await prisma.$queryRaw`SELECT * FROM user INNER JOIN member WHERE email=${req.body.email} AND password=${req.body.password}`
  else data = await prisma.$queryRaw`SELECT * FROM user INNER JOIN officer WHERE email=${req.body.email} AND password=${req.body.password}`
  data = (data as any)[0]

  res.send({
    data: {
      token: JSON.stringify(data),
      permissions: [],
      profile: data
    }
  })
}