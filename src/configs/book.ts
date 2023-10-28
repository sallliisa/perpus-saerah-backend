import { prisma } from "@/lib/db"
import config from "config"

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
      const user_rating = req.headers.authorization ? await prisma.bookRating.findFirst({
        where: {
          book_id: Number(req.params.id),
          member_id: JSON.parse(req.headers.authorization).id
        }
      }) : null
      return {...result, user_rating, img_photo: {file: result.img_photo, preview: `${config.base_url}/storage/${result.img_photo}`}}
    }
  },
  create: {
    beforeExecute: async (req: any, res: any) => {
      req.body.img_photo = req.body.img_photo.file
      return req.body
    }
  },
  update: {
    fields: ["name", "isbn", "author", "publisher", "publishing_city", "editor", "img_photo", "category_id", "stock", "active"],
    beforeExecute: async (req: any, res: any) => {
      req.body.img_photo = req.body.img_photo.file
      console.log(req.body)
      return req.body
    }
  },
  list: {
    searchable: ["name", "isbn", "author", "publisher"],
    afterExecute: async (result: any, req: any, res: any) => {
      return result.map((res: any) => {
        console.log(res)
        return ({...res, img_photo: {file: res.img_photo, preview: `${config.base_url}/storage/${res.img_photo}`}})
      })
    }
  }
}