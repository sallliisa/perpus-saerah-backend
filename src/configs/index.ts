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
  }
} as Record<string, any>