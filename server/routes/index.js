const router = require('express').Router();	//include express
const mongoose = require('mongoose');		//include mongoose
const User = require('../model/user.js');	//include user model
const Pertemanan = require('../model/pertemanan.js');	//include pertemanan model

//mongosoe connect
mongoose.connect('mongodb://localhost:27017/node_sosmed_course')
let db = mongoose.connection;
db.on('error', (err) => {
	console.log(`db error : ${err.message}`);
});

//ROUTES
	//register route
	router.post('/register', (req, res, next) =>{
		//console.dir(req.body);

		let userData = {
			fullname: req.body.fullname,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		};

		let pertemananData = {
			fullname: req.body.fullname,
			email: req.body.email,
			username: req.body.username
		};



		//save data
		User.create(userData, function (err, data){
			if(err){
				let error = new Error('Error creating new user');
				error.status = 404;
				next(error);
			} 
			else{
				console.log("Create user success");

				//Create pertemanan data
				pertemananData["userId"] = data._id;
				Pertemanan.create(pertemananData, function (err){
					if(err){
						let error = new Error('Error creating new pertemanan');
						error.status = 404;
						next(error);
					} 
					else{
						console.log("Create pertemanan data success");
					} 
				});

				return res.json(data)
			} 
		});
	});

	//login route
	router.post('/login', (req, res, next) => {
		let userData = {
			username: req.body.username,
			password: req.body.password
		};
		/*console.log("Server");
		console.log("Username : ", userData.username);
		console.log("Password : ", userData.password);*/
		
		//check hashed password
		User.passwordCheck(userData.username, userData.password, (status) => {
			if(status){
				console.log("Login successful");
				return res.json(userData);
			}else{
				let error = new Error('Wrong password');
				error.status = 404;
				next(error);
			}
		});
	});

	//get profile data
	router.post('/getProfileData', (req, res, next) => {
		User.getProfileData(req.body.username, (data) => {
			if(data){
				console.log("Found profile data");
				return res.json(data);
			}else{
				let error = new Error('Data not found');
				error.status = 404;
				next(error);
			}
		});
	});

	//get all users data
	router.post('/getAllUserData', (req, res, next) => {
		let userData = {
			username: req.body.username
		}
		
		//get friends data
		Pertemanan.findOne({username:userData.username}).populate('friends', 'username').exec((err, friendlist) => {
	    	console.log("ini friendlistnya",friendlist)
			
	    	let friendData = [];
	    	for(var i=0 ; i<friendlist.friends.length ; i++){
	    		friendData.push(friendlist.friends[i].username)
	    	}
	    	friendData.push(userData.username);

	    	console.log(friendData)
	    	User.find({username:{$nin:friendData}}, (err, data) => {
	    		//console.log("ini datanya", data)
				return res.json(data);
			}).catch(err => {
				console.log("Data not found");
			});
	    })
	});

	//add friend
	router.post('/addFriend', (req, res, next) => {
		let data = {
        	username: req.body.username,
	        friend_username: req.body.friend_username
	    }

	    Pertemanan.findOne({username:data.username}).exec((err1, myUserData) => {
	    	if (err1) return res.json("err1")
	        console.log("1", myUserData)

	    	Pertemanan.findOneAndUpdate({username:data.friend_username}, {$push: {friends: myUserData.userId}}, (err2, updatedMyData) => {
	            if (err2) return res.json("err2")            
	            console.log("2", updatedMyData)

	            Pertemanan.findOne({username:data.friend_username}).exec((err3, otherUserData) => {
	                if (err3) return res.json("err3")                
	                console.log("3", otherUserData)

	                Pertemanan.findOneAndUpdate({username:data.username}, {$push: {friends: otherUserData.userId}}, (err4, updatedOtherData) => {
	                    if (err4) return res.json("err4")
	                    console.log("4", updatedOtherData)
	                	return res.json(data)
	                    res.send("friend added")
	                })
	            })
	        })
	    }) 
	});

	//delete friend
	router.post('/deleteFriend', (req, res, next) => {
		let data = {
        	username: req.body.username,
	        friend_id: req.body.friend_id
	    }

	    Pertemanan.findOneAndUpdate({username: data.username}, {$pull: {friends: data.friend_id}}, (err, res1) => {
        	if(err){
				let error = new Error('Data not found');
				error.status = 404;
				next(error);
			}else{
			    User.getProfileData(data.username, (userData) => {
					if(userData){
						console.log("ini data id temennya", data.friend_id)
						console.log("ini data id saya", userData._id)

						Pertemanan.findOneAndUpdate({userId: data.friend_id}, {$pull: {friends: userData._id}}, (err, res2) => {
				        	if(err){
								let error = new Error('Data not found');
								error.status = 404;
								next(error);
							}else{
								return res.json(data);
							}
					    });
					}else{
						let error = new Error('Data not found');
						error.status = 404;
						next(error);
					}
				});
			}
	    });

	})

	//get all friends data
	router.post('/getAllFriends', (req, res) => {
	    Pertemanan.findOne({username:req.body.username}).populate('friends', 'fullname').exec((err, friendlist) => {
	    	return res.json(friendlist)
	    })
	})

module.exports = router;