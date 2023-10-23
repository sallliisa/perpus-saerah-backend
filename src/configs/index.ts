import { prisma } from "../lib/db"

export default {
  book: {
    relation: {
      category: ['name']
    },
    show: {
      afterExecute: (result: any, req: any, res: any) => {
        const hasRated = !!prisma.bookRating.findFirst({
          where: {
            book_id: req.params.id,
            member_id: 1
          }
        })
        return {...result, hasRated}
      }
    }
  },
  bookRating: {
    relation: {
      member: ['name']
    }
  },
  bookComment: {
    relation: {
      member: ['name']
    }
  },
  member: {
    create: {
      afterExecute: async (result: any, req: any, res: any) => {
        const user = await prisma.user.create({
          data: {
            email: result.email,
            password: result.password,
            ref_id: result.id,
            type: 'member'
          }
        })
        return {...result, user}
      }
    }
  },
  officer: {
    create: {
      afterExecute: async (result: any, req: any, res: any) => {
        const user = await prisma.user.create({
          data: {
            email: result.email,
            password: result.password,
            ref_id: result.id,
            type: 'officer'
          }
        })
        return {...result, user}
      }
    }
  }
} as Record<string, any>