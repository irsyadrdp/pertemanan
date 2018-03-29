const fetch = require('node-fetch');

//post request
function createPostRequest(req, res, next) {

    fetch(`http://localhost:2222${req.originalUrl}`, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {
        if (!json.error) {
            res.locals.page = req.originalUrl.slice(1)
            res.locals.data = json
            console.log("[Client]: Create user success");
            next()
        } else {
            //console.log(req.originalUrl.slice(1) + " process is error")
            let someError
            if (req.originalUrl.slice(1) == 'register') {
                someError = new Error('Error when creating user')
            } else {
                someError = new Error('Wrong password')                
            }
            someError.status = 400
            next(someError)
        }
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at createPostRequest')
        someError.status = 400
        next(someError)
    })
}

//register
function register(req, res, next){

    fetch(`http://localhost:2222/register`, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {

        if (!json.error) {
            console.log('[Client] : Register success ')
            next()
        } else {
            let someError = new Error('[Client] : Register failed')
            someError.status = 400
            next(someError)
        }
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at register')
        someError.status = 400
        next(someError)
    })
}

//log put request
function loggedOut(req, res, next) {
    if (req.cookies.username) {
    	res.clearCookie("username");
        res.redirect('/login')
    }
    next()
}

//login check auth
function requiresLogin(req, res, next) {
    if(req.cookies.username) {
        return next();
    } else {
        var err = new Error('Please log in first');
        err.status = 401;
        return next(err);
    }
}

//get profile data
function getProfile(req, res, next) {
    let usernameData = {
        username : req.cookies.username
    }

    fetch(`http://localhost:2222/getProfileData`, {
        method: "POST",
        body: JSON.stringify(usernameData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(profile => {
        if (!profile.error) {
            console.log('Get profile data success')
            res.locals.profile = profile
            next()
        }else {
            let someError = new Error('Fetch all data failed')
            someError.status = 400
            next(someError)
        }
    })
}

//get data all user
function getAllUserData(req, res, next){
    let usernameData = {
        username : req.cookies.username
    }

    fetch(`http://localhost:2222/getAllUserData`, {
        method: "POST",
        body: JSON.stringify(usernameData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {
        
        if (!json.error) {
            console.log("data getAll di client")
            console.log(json)
            console.log('Fetch all data success')
            res.locals.datas = json
            next()
        }else {
            let someError = new Error('Fetch all data failed')
            someError.status = 400
            next(someError)
        }
        
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at getAllUserData')
        someError.status = 400
        next(someError)
    })
}

//get all friends data
function getAllFriends(req, res, next){
    let usernameData = {
        username : req.cookies.username
    }

    fetch(`http://localhost:2222/getAllFriends`, {
        method: "POST",
        body: JSON.stringify(usernameData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {
        console.log("data teman di client",json.friends)
        if (!json.error) {
            res.locals.friends = json.friends
            next()
        }else {
            let someError = new Error('Fetch all friends data failed')
            someError.status = 400
            next(someError)
        }
        
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at getAllFriends')
        someError.status = 400
        next(someError)
    })
}

//add friend
function addFriend(req, res, next){

    let data = {
        username : req.cookies.username,
        friend_username : req.params.username 
    };

    fetch(`http://localhost:2222/addFriend`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {

        if (!json.error) {
            console.log('Success adding friend')
            next()
        } else {
            let someError = new Error('Failed adding friend')
            someError.status = 400
            next(someError)
        }
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at addFriend')
        someError.status = 400
        next(someError)
    })
}

//delete friend
function deleteFriend(req, res, next){

    let data = {
        username : req.cookies.username,
        friend_id : req.params.id 
    };

    fetch(`http://localhost:2222/deleteFriend`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(resp => resp.json())
    .then(json => {

        if (!json.error) {
            console.log('Success deleting friend')
            next()
        } else {
            let someError = new Error('Failed deleting friend')
            someError.status = 400
            next(someError)
        }
    })
    .catch(err => {
        console.log(err)
        let someError = new Error('Something wrong at deleteFriend')
        someError.status = 400
        next(someError)
    })
}




module.exports.requiresLogin = requiresLogin;
module.exports.loggedOut = loggedOut;
module.exports.createPostRequest = createPostRequest;
module.exports.register = register;
module.exports.addFriend = addFriend;
module.exports.deleteFriend = deleteFriend;
module.exports.getAllUserData = getAllUserData;
module.exports.getAllFriends = getAllFriends;
module.exports.getProfile = getProfile;