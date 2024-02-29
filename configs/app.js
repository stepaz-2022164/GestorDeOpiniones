import express from 'express'
import {config} from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import postRoutes from '../src/post/post.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/user', userRoutes)
app.use('/posts', postRoutes)
app.use('/comment', commentRoutes)

export const initServer = () => {
    app.listen(port)
    console.log(`Server running on port ${port}`)
}