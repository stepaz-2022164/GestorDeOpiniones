'use strict'

import Post from './post.model.js'

export const createPost = async (req, res) => {
    try {
        let {title, category, text} = req.body
        let userId = req.user._id
        let newPost = new Post({
            title,
            category,
            text,
            user: userId
        })
        await newPost.save()
        return res.send({ message: 'Post created succesfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating post' })
    }
}

export const editPost = async (req, res) => {
    try {
        let postId = req.params.id
        let existingPost = await Post.findOne({ _id: postId })
        let userId = req.user._id
        let data = req.body
        if (existingPost.user.toString() !== userId.toString()) return res.status(404).send({message: 'You only can edit your posts'})
        let updatePost = await Post.findOneAndUpdate(
            {_id: postId},
            data,
            {new: true}
        )
        if (!updatePost) return res.status(404).send({message: 'Post not found and not updated'})
        return res.send({ message: 'Post updated succesfully', updatePost })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating post' })
    }
}

export const deletePost = async (req, res) => {
    try {
        let postId = req.params.id
        let existingPost = await Post.findOne({ _id: postId })
        let userId = req.user._id
        if (existingPost.user.toString() !== userId.toString()) return res.status(404).send({message: 'You only can delete your posts'})
        let deletePost = await Post.findOneAndDelete({ _id: postId })
        if (!deletePost) return res.status(404).send({message: 'Post not found and not deleted'})
        return res.send({ message: 'Post deleted succesfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting post' })
    }
}

export const getPosts = async (req, res) => {
    try {
        let posts = await Post.find().populate({
            path: 'comments',
            select: 'text'
        })
        return res.send({posts})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting posts'})
    }
}