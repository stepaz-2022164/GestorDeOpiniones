'use strict'

import Comment from './comment.model.js'
import Post from '../post/post.model.js'

export const createComment = async (req, res) => {
    try {
        let {text} = req.body
        let userId = req.user._id
        let postId = req.params.pid
        let post = await Post.findOne({_id: postId})
        if (!post) return res.status(404).send({message: 'Post not found'})
        let comment = new Comment({
            user: userId,
            text
        })
        await comment.save()
        if (comment) {
            if (!post) return res.status(404).send({message: 'Post not found'})
            post.comments.push(comment._id)
            await post.save()
        }
        return res.send({message: 'Comment saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving comment'})
    }
}

export const editComment = async (req, res) => {
    try {
        let commentId = req.params.cid
        let existingComment = await Comment.findOne({_id: commentId})
        let post = await Post.findOne({comments: commentId})
        if (!post) return res.status(404).send({message: 'Post or comment not found'})
        let userId = req.user._id
        let data = req.body
        if (existingComment.user.toString() !== userId.toString()) return res.status(404).send({mesasge: 'You only can edit your comments'})
        let updateComment = await Comment.findOneAndUpdate(
            {_id: commentId},
            data,
            {new: true}
        )
        if (!updateComment) return res.status(404).send({message: 'Comment not found and not updated'})
        if (updateComment) {
            post.comments.push(commentId)
            await post.save()
        }
        return res.send({message: 'Comment updated successfully', updateComment})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error editing comment'})
    }
}

export const deleteComment = async (req, res) => {
    try {
        let commentId = req.params.cid
        let existingComment = await Comment.findOne({_id: commentId})
        let post = await Post.findOne({comments: commentId})
        if (!post) return res.status(404).send({message: 'Post or comment not found'})
        let userId = req.user._id
        if (existingComment.user.toString() !== userId.toString()) return res.status(404).send({mesasge: 'You only can delete your comments'})
        let deleteComment = await Comment.findOneAndDelete({_id: commentId})
        if (!deleteComment) return res.status(404).send({message: 'Comment not found and not deleted'})
        if (deleteComment) {
            post.comments.pull(commentId)
            await post.save()
        }
        return res.send({message: 'Comment deleted successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting comment'})
    }
}