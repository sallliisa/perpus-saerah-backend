import { Handler } from 'express'
import {get as _get} from '../../protected/:model/list'

export const get: Handler = (req, res) => {
    req.params.model = 'book'
    return _get(req, res, null)
}