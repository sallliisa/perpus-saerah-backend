import { Handler } from "express"
import { prisma } from "../../lib/db"
import { deepmerge } from "deepmerge-ts"
import configs from "../../configs"

export const get: Handler = async (req, res) => {
    res.send("OK")
}