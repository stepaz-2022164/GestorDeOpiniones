'use strict'

import {Schema, model} from 'mongoose'

const commentSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

export default model('comment', commentSchema)