import dotenv from 'dotenv'
dotenv.config()
import express, { urlencoded } from 'express'
import methodOverride from 'method-override'
import morgan from 'morgan'

import loginRoutes from './routes/authRoute.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import errorHandler from './middlewares/errorHandler.js'
import db from './helpers/db.js'
import verify from './middlewares/verify.js'

const app = express()

//middlewares
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

//Routes
app.use('/api', loginRoutes)
app.use('/api/admin',verify('admin'), adminRoutes)
app.use('/api/user',verify('user'), userRoutes)
app.use('*',(req,res)=>{
  res.status(500).json({
      status:'Sorry Route does not exists',
  })
})
app.use(errorHandler)

// Database configuration
db()

const PORT = process.env.PORT
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);