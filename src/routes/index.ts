import { prisma } from "../lib/db"

export const get: Handler = async (req, res) => {
    res.send("OK")
}