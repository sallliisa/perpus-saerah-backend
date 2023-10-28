import { Handler } from 'express'
import {post as _post} from '@/routes/protected/:model/create'

export const post: Handler = (req, res) => {
    req.params.model = 'member'
    return _post(req, res, null)
}