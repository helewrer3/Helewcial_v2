const route = require('express').Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Post = require('../models/Post')

//DESC login
//ROUTE get /
route.get('/', ensureGuest, (req, res) => {
    res.render('login', {layout: 'login'})
})

//DESC Dashboard
//ROUTE get /dashboard
route.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.displayName,
            posts: posts
        })
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

module.exports = route