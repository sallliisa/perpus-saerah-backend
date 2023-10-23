import { Handler } from "express"
import { prisma } from "../lib/db"
import { deepmerge } from "deepmerge-ts"

export const get: Handler = async (req, res) => {
    // const result = await prisma..findMany()
    
    res.send(deepmerge({a: 1, b: 2, c: {d: 4, e: 5}}, {c: {e: 1, f: 6}}))
}