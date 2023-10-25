import { prisma } from "@/lib/db"

export default {
  relation: {
    category: {
      select: {
        name: true
      }
    }
  },
  show: {
    afterExecute: async (result: any, req: any, res: any) => {
      const hasRated = !!await prisma.bookRating.findFirst({
        where: {
          book_id: Number(req.params.id),
          member_id: JSON.parse(req.headers.authorization).id
        }
      })
      return {...result, hasRated}
    }
  },
  list: {
    searchable: ["name", "isbn", "author", "publisher"]
  }
}