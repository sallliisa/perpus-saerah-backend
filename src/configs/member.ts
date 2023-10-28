import { prisma } from "@/lib/db"
import config from "config"

export default {
  relation: {
    user: {
      select: {
        name: true,
        email: true
      }
    }
  },
  show: {
    afterExecute: async (result: any, req: any, res: any) => {
      return {...result, img_photo: {file: result.img_photo, preview: `${config.base_url}/storage/${result.img_photo}`}}
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
      req.body.img_identity_photo = req.body.img_identity_photo.file
      return {...req.body, user_id: user.id}
    },
  },
  update: {
    beforeExecute: async (req: any, res: any) => {
      req.body.img_identity_photo = req.body.img_identity_photo.file
      return req.body
    }
  },
  list: {
    afterExecute: async (result: any, req: any, res: any) => {
      return result.map((res: any) => {
        return ({...res, img_identity_photo: {file: res.img_identity_photo, preview: `${config.base_url}/storage/${res.img_identity_photo}`}})
      })
    }
  }
}