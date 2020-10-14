const Post = require('../models/Post')
const Comment = require('../models/Comment')
const auth = require('../middleware/auth.middleware')
const {Router} = require("express")
const router = Router()

router.post('/:postId', auth, async (req, res) => {
    try {
        const comment = new Comment({text: req.body.text, owner: req.user.userId})
        await comment.save()
        await Post.findByIdAndUpdate(req.params.postId,
            {$addToSet: {comments: comment._id}},
            {new: true})
        res.status(201).json({comment})
    } catch (err) {
        res.status(500).json({message: "Something go wrong, try again"})
    }
})

module.exports = router