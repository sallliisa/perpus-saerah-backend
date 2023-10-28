import { Handler } from "express";
import { existsSync } from "fs";
import config from "config";

export const post: Handler = async (req, res) => {
  Object.values(req.files).forEach((file: any) => {
    while (existsSync(`storage/${file.name}`)) file.name = `d_${file.name}`
    file.mv(`storage/${file.name}`, (err: any) => {
      if (err) return res.status(500).send({error_message: err})
      res.status(200).send({success: true, data: {file: file.name, preview: `${config.base_url}/storage/${file.name}`}})
    })
  })
}