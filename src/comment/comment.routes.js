'use strict'

import express from 'express'
import {createComment, editComment, deleteComment} from './comment.controller.js'
import {validateToken} from '../middleware/validate-jwt.js'

const api = express.Router()

api.post('/createComment/:pid', validateToken, createComment)
api.put('/editComment/:cid', validateToken, editComment)
api.delete('/deleteComment/:cid', validateToken, deleteComment)

export default api