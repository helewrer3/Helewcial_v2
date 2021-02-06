const route = require('express').Router()
const {ensureAuth, ensureOwner} = require('../middleware/auth')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

//DESC Show posts
//ROUTE get /posts
route.get('/', ensureAuth, async (req, res) => {
    try {
        Post.find().populate('user').sort({createdAt: 'desc'}).lean().exec((err, data) => {
            if(err)throw err
            res.render('posts/index', {data})
        })
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

//DESC Show post by id
//ROUTE get /posts/show/id
route.get('/show/:id', ensureAuth, async (req, res) => {
    try {
        Post.findById(req.params.id).populate('user').lean().exec((err, data) => {
            if(err)throw err
            Comment.find({post: req.params.id}).populate('user').lean().exec((err, data2) => {
                if(err)throw err
                console.log(data2)
                res.render('posts/post', {data, data2})
            })
        })
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

//DESC Create comments
//ROUTE post /posts/show/id
route.post('/show/:id', ensureAuth, async (req, res) => {
    try {
        req.body.post = req.params.id
        req.body.user = req.user.id
        await Comment.create(req.body)
        res.redirect(`/posts/show/${req.params.id}`)
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

//DESC Show add page
//ROUTE get /posts/add
route.get('/add', ensureAuth, (req, res) => {
    res.render('posts/add')
})

//DESC Add post
//ROUTE post /posts/add/
route.post('/add', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Post.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

//DESC Show edit page
//ROUTE get /posts/edit/id
route.get('/edit/:id', ensureAuth, ensureOwner, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).lean()
        if(!post)throw error;
        res.render('posts/edit', {post})
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
    res.render('posts/add')
})

//DESC Edit post
//ROUTE post /posts/edit/id
route.post('/edit/:id', ensureAuth, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

//DESC Delete post
//ROUTE get /posts/del/id
route.get('/del/:id', ensureAuth, ensureOwner, async (req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.id)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/error')
    }
})

module.exports = route