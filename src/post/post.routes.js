'use strict'

import express from 'express'
import { createPost, deletePost, editPost } from './post.controller.js'
import { validateToken } from '../middleware/validate-jwt.js'

const api = express.Router()

api.post('/createPost', validateToken, createPost)
api.put('/editPost/:id', validateToken, editPost)
api.delete('/deletePost/:id', validateToken, deletePost)

export default api