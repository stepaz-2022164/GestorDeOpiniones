import express from 'express'
import {config} from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import postRoutes from '../src/post/post.routes.js'
import commentRoutes from '../src/comment/comment.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import {defaultCategory} from '../src/category/category.controller.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/user', userRoutes)
app.use('/posts', postRoutes)
app.use('/comment', commentRoutes)
app.use('/category', categoryRoutes)

export const initServer = () => {
    defaultCategory()
    app.listen(port)
    console.log(`Server running on port ${port}`)
}