const router = require('express').Router()
const mid = require('../middleware/index')

//ROUTES

	//home
	router.get('/', mid.requiresLogin, (req, res) => {
	    res.redirect('/profile')
	})


	//login
	router.get('/login', mid.loggedOut, (req, res) => {
	    res.render('login')
	})
	router.post('/login', mid.createPostRequest, (req, res) => {
	    res.cookie('username', res.locals.data.username)
	    res.redirect('/profile')
	})


	//register
	router.get('/register', mid.loggedOut, (req, res) => {
	    res.render('register')
	})
	router.post('/register', mid.register, (req, res) => {
	    res.redirect('/')
	})


	//profile
	router.get('/profile', mid.requiresLogin, mid.getProfile, (req, res) => {
	    //res.locals.fullname = req.cookies.username
	    res.render('profile')
	})


	//add friend
	router.get('/add', mid.requiresLogin, mid.getAllUserData, (req, res) => {
	    res.render('add')
	})
	router.get('/addFriend/:username', mid.requiresLogin, mid.addFriend, (req, res) => {
	    res.redirect('/add')
	})


	//delete friend
	router.get('/deleteFriend/:id', mid.requiresLogin, mid.deleteFriend, (req, res) => {
		res.redirect('/friends')
	})


	//view friends
	router.get('/friends', mid.requiresLogin, mid.getAllFriends, (req, res) => {
		res.render('friend')
	})

	//logout
	router.get('/goodbye', (req, res) => {
	    res.clearCookie('username')
	    res.clearCookie('id_user')
	    res.redirect('/')
	})


module.exports = router