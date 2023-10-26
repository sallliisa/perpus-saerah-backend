import { prisma } from "@/lib/db"

export default {
  relation: {
    member: {
      select: {
        user: {
          select: {
            name: true
          }
        }
      }
    },
    officer: {
      select: {
        user: {
          select: {
            name: true
          }
        }
      }
    },
    book: {
      select: {
        name: true
      }
    }
  },
  list: {
    filterable: ["status_code"],
    orderBy: {
      created_at: 'desc'
    },
    queryGenerator: async (req: any, res: any) => {
      const profile = JSON.parse(req.headers.authorization)
      if (profile.type === 'member') return {where: {member_id: profile.id}}
      else return {}
    },
    beforeExecute: async (query: any, req: any, res: any, params: any) => {
      await prisma.$queryRaw`
        UPDATE borrowing
        SET status_code='overdue'
        WHERE (julianday('now') - julianday(datetime(ROUND(Cast(created_at as Integer)/1000), 'unixepoch', 'localtime'))) > 14
      `
      return query
    }
  },
  create: {
    fields: ["member_id", "officer_id", "book_id"],
    validator: async (req: any, res: any) => {
      if ((await prisma.book.findFirst({ where: { id: req.body.book_id } })).stock <= 0) 
        throw new Error('Stok buku sudah habis!')
      if ((await prisma.member.findFirst({ where: {id: req.body.member_id} })).verified != 1) 
        throw new Error('Member belum terverifikasi')
      if ((await prisma.borrowing.count({ where: { member_id: req.body.member_id, returned_at: null } })) >= 2) 
        throw new Error('Member sudah mencapai batas peminjaman buku')
      if ((await prisma.borrowing.count({ where: { member_id: req.body.member_id, book_id: req.body.book_id, status_code: 'ongoing' } }) > 0)) 
        throw new Error('Member sudah meminjam buku ini')
    },
    beforeExecute: async (req: any, res: any) => {
      return {...req.body, officer_id: JSON.parse(req.headers.authorization).id}
    },
    afterExecute: async (result: any, req: any, res: any) => {
      await prisma.book.update({
        where: { id: req.body.book_id },
        data: { stock: {decrement: 1} }
      })
    }
  },
  update: {
    fields: ["returned_at", "fine", "status_code"],
    beforeExecute: async (req: any, res: any) => {
      const differenceInDays = (new Date().getTime() - new Date(req.body.created_at).getTime()) / (1000 * 3600 * 24)
      return {...req.body, fine: differenceInDays > 14 ? (differenceInDays - 14) * 1000 : 0 }
    },
    afterExecute: async (result: any, req: any, res: any) => {
      await prisma.book.update({
        where: { id: result.book_id },
        data: { stock: {increment: 1} }
      })
    }
  }
}