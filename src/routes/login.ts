import { Handler } from "express"

export const post: Handler = (req, res) => {
    res.send({
        data: {
            token: 'hiyaimatoken',
            permissions: [],
            profile: {}
        }
    })
}