import express from 'express'
import routes from './routes/index.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server executando em http://localhost:${PORT}`)
})