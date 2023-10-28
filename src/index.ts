import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { router } from 'express-file-routing'
import path from 'path'
import fileUpload from 'express-fileupload'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload({useTempFiles: true, tempFileDir: './tmp/', createParentPath: true}));

app.use('/api', await router({directory: path.join(path.dirname(process.argv[1]), "routes", "unprotected")}))

app.use((req, res, next) => {
  if (req.headers.authorization) next()
  else res.status(403).send({forbidden: true})
})

app.use('/api', await router({directory: path.join(path.dirname(process.argv[1]), "routes", "protected")}))

app.listen(6969, () => console.log('Started', path.join(path.dirname(process.argv[1]), "routes", "protected")))