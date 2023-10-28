import { Handler } from "express"
import path from "path"

export const get: Handler = async (req, res) => {
  try {
    res.sendFile(`${req.params.filename}`, {root: path.join(path.dirname(process.argv[1]), '../storage')})
  } catch (err) {
    res.status(500).send({error_message: err})
  }
}