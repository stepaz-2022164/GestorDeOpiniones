'use strict'

import User from '../user/user.model.js'
import jwt from 'jsonwebtoken'

export const validateToken = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized access'})
        let {uid} = jwt.verify(token, secretKey)
        let user = await User.findOne({_id: uid})
        if (!user) return res.status(401).send({message: 'User not found | Unauthorized'})
        req.user = user
        next()
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error verifying token'})
    }
}