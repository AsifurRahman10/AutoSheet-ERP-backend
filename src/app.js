import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: '16kb'
}))

app.use(urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use(express.static('public'))

app.use(cookieParser())

// import routers

// router declaration


export { app }