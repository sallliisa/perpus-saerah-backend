import { prisma } from "@/lib/db"
import { Handler } from "express"

export const post: Handler = async (req, res) => {
  if (req.body.email === 'GUEST' && req.body.password === 'GUEST') {
    res.send({
      data: {
        token: "",
        permissions: ['view-library'],
        profile: {}
      }
    })
    return
  }
  const result = await prisma.user.findFirst({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })

  if (!result) return res.status(403).send({error_message: 'Username atau password salah!'})

  let data
  if (result.type === 'member') data = await prisma.$queryRaw`SELECT member.*, user.name, user.email, user.type FROM member INNER JOIN user ON member.user_id=user.id WHERE user.email=${req.body.email} AND user.password=${req.body.password}`
  else if (result.type === 'officer') data = await prisma.$queryRaw`SELECT officer.*, user.name, user.email, user.type FROM officer INNER JOIN user WHERE user.email=${req.body.email} AND user.password=${req.body.password}`
  data = (data as any)?.[0]

  console.log("DATA", data)

  let permissions: Array<string> = ['view-library']

  if (result.type === 'member') {
    permissions = [
      'view-borrowing', 'show-borrowing',
      'view-library',
      'create-book-rating',
      'create-book-comment'
    ]
  } else if (result.type === 'officer') {
    permissions = [
      'view-library',
      'view-book', 'create-book', 'update-book', 'delete-book', 'show-book',
      'view-category', 'create-category', 'update-category', 'delete-category', 'show-category',
      'view-borrowing', 'create-borrowing', 'update-borrowing', 'delete-borrowing', 'show-borrowing',
      'view-member', 'create-member', 'update-member', 'delete-member', 'show-member',
      'view-officer', 'create-officer', 'update-officer', 'delete-officer', 'show-officer',
      'view-user', 'create-user', 'update-user', 'delete-user', 'show-user',
    ]
  }

  res.send({
    data: {
      token: JSON.stringify(data || "GUEST_TOKEN"),
      permissions: permissions,
      profile: data
    }
  })
}