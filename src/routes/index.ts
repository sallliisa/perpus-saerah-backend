import { Handler } from "express"
import { prisma } from "../lib/db"

export const get: Handler = async (req, res) => {
    // const result = await prisma..findMany()
    res.send("OK")
}