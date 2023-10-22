import { prisma } from "../utils/db"

export const get: Handler = async (req, res) => {
    const result = await prisma.user.fields
    res.send(result)
}