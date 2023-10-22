import express, { Handler } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { router } from 'express-file-routing'
import path from 'path'
import { error } from 'console'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use('/api', await router({directory: path.join(path.dirname(process.argv[1]), "routes")}))

app.listen(6969, () => console.log('Started'))