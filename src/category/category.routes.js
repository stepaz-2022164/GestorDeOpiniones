'use strict'

import express from 'express'
import { deleteCategory, getCategories, createCategory, editCategory } from './category.controller.js'
import { validateToken } from '../middleware/validate-jwt.js'

const api = express.Router()

api.post('/createCategory', validateToken , createCategory)
api.get('/getCategories', validateToken, getCategories)
api.put('/editCategory/:id', validateToken , editCategory)
api.delete('/deleteCategory/:id', validateToken , deleteCategory)

export default api