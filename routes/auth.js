const route = require('express').Router()
const passport = require('passport')

//DESC Auth with google
//ROUTE get /auth/google
route.get('/google', passport.authenticate('google', {scope: ['profile']}))

//DESC Google callback
//ROUTE get /auth/google/callback
route.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

//DESC Logout user
//ROUTE get /auth/logout
route.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = route