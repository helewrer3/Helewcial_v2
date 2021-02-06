const Post = require('../models/Post')

module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()) return next()
        else return res.redirect('/')
    },
    ensureGuest: (req, res, next) => {
        if(req.isAuthenticated()) return res.redirect('/dashboard')
        else return next()
    },
    ensureOwner: async (req, res, next) => {
        const post = await Post.findById(req.params.id).lean()
        if(JSON.stringify(req.user._id) === JSON.stringify(post.user)) return next()
        else return res.redirect('/dashboard')
    }
}