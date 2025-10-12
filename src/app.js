import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()
app.use(morgan('dev'))
const getAllowedOrigins = () => {
  const rawOrigins =
    process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000'
  return rawOrigins.split(',').map((origin) => origin.trim())
}

const allowedOrigins = getAllowedOrigins()

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error(`CORS policy: Origin ${origin} is not allowed`))
  },
  credentials: true, // Allow cookies
}

app.use(cors(corsOptions))

// app.use(
//   cors({
//     origin: '*', // allow any origin
//     credentials: true, // still allow cookies
//   })
// )

app.use(
  express.json({
    limit: '16kb',
  })
)

app.use(
  urlencoded({
    extended: true,
    limit: '16kb',
  })
)

app.use(express.static('public'))

app.use(cookieParser())

// import routers
import sessionRouter from './routes/session.route.js'

// router declaration
app.use('/api/v1/auth', sessionRouter)

export { app }
