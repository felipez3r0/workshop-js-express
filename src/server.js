import express from 'express'
import routes from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger-output.json' with { type: "json" }

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api', routes)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(PORT, () => {
  console.log(`Server executando em http://localhost:${PORT}`)
})