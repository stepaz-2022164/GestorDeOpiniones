'use strict'

import express from 'express'
import { test, register, login, update, updatePassword} from './user.contoller.js'
import { validateToken } from '../middleware/validate-jwt.js'

const api = express.Router()

//Rutas publicas
api.get('/test', test)
api.post('/register', register)
api.post('/login', login)

//Rutas para usuarios logeados
api.put('/update/:id', validateToken ,update)
api.put('/updatePassword/:id', validateToken, updatePassword)

export default api