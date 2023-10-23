import { prisma } from "../lib/db"

export default {
  book: {
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
    }
  },
  bookRating: {
    relation: {
      member: {
        select: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    create: {
      beforeExecute: async (req: any, res: any) => {
        return {...req.body, member_id: JSON.parse(req.headers.authorization).id}
      }
    },
  },
  bookComment: {
    relation: {
      member: {
        select: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    create: {
      beforeExecute: async (req: any, res: any) => {
        return {...req.body, member_id: JSON.parse(req.headers.authorization).id}
      }
    },
  },
  member: {
    relation: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    create: {
      fields: ['identity_number', 'address', 'city', 'phone', 'img_identity_photo', 'active', 'user_id'],
      beforeExecute: async (req: any, res: any) => {
        const user = await prisma.user.create({
          data: {
            name: req.body.user_name,
            email: req.body.user_email,
            password: req.body.user_password,
            type: 'member'
          }
        })
        return {...req.body, user_id: user.id}
      },
    }
  },
  officer: {
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
} as Record<string, any>