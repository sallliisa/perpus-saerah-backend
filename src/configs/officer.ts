import { prisma } from "@/lib/db"

export default {
  relation: {
    user: {
      select: {
        name: true,
        email: true
      }
    }
  },
  create: {
    fields: ['active', 'user_id'],
    beforeExecute: async (req: any, res: any) => {
      const user = await prisma.user.create({
        data: {
          name: req.body.user_name,
          email: req.body.user_email,
          password: req.body.user_password,
          type: 'officer'
        }
      })
      return {...req.body, user_id: user.id}
    }
  }
}