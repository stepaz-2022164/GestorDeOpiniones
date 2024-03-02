'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { createToken } from '../utils/jwt.js'

export const test = async (req, res) => {
    return res.send('Hello, world')
}

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let existingUser = await User.findOne({ username: data.username })
        if (existingUser) return res.status(400).send({ message: 'User already exists' })
        let user = new User(data)
        await user.save()
        return res.send({ message: 'User created succesfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
                surname: user.surname,
            }
            let token = await createToken(loggedUser)
            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error logging in' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({ message: 'You only can update your user'})
        let update = checkUpdate(data, userIdU)
        if (!update) return res.status(400).send({ message: 'Can not update because missing data' })
        let updatedUser = await User.findOneAndUpdate(
            { _id: userIdU },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
        return res.send({ message: 'User updated succesfully', updatedUser })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const updatePassword = async (req, res) => {
    try {
        let data = req.body
        let userIdU = req.params.id
        let userIdL = req.user._id
        let user = await User.findOne({ _id: userIdU })
        let password = data.password
        if (userIdL.toString() !== userIdU.toString()) return res.status(404).send({ message: 'You only can update your user'})
        if (user && await checkPassword(password, user.password)) {
            if (data.passwordNew) data.passwordNew = await encrypt(data.passwordNew)
            let update = checkUpdate(data, userIdU)
            if (!update) return res.status(400).send({ message: 'Can not update because missing data' })
            let updatedUser = await User.findOneAndUpdate(
                { _id: userIdU },
                { password: data.passwordNew },
                { new: true }
            )
            if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'User password updated succesfully'})
        }
        return res.status(404).send({ message: 'Password is not correct' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating password' })
    }
}
