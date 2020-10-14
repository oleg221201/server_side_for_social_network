const Post = require("../models/Post")
const User = require('../models/User')
const auth = require("../middleware/auth.middleware")
const {Router} = require('express')
const router = Router()

router.get("/news", auth, async (req, res) => {
    try {
        const posts = await Post.find({})
        res.json(posts)
    } catch (err) {
        res.status(500).json({message: 'Something go wrong, try again'})
    }
})

router.get("/:id", auth, async (req, res) =>  {
    try {
        const post = await Post.findById({_id: req.params.id})
        res.json({post})
    } catch (err) {
        res.status(500).json({message: 'Something go wrong, try again'})
    }
})

router.post("/create", auth, async (req, res) => {
    try {
        const post = new Post({text: req.body.text, owner: req.user.userId})
        await post.save()
        await User.findByIdAndUpdate(req.user.userId,
            {$addToSet: {posts: post._id}},
            {new: true})
        res.status(201).json({post})
    } catch (err) {
        res.status(500).json({message: 'Something go wrong, try again', err: err.message})
    }
})

module.exports = router