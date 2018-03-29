//include modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//create user's schema
let UserSchema = new mongoose.Schema(
	{
		//fkIdUser 	 : {type:mongoose.Schema.Types.ObjectId, required:true, unique:true, ref:'Pertemanan'},
		fullname : {type:String, required:true},
		email 	 : {type:String, required:true,	unique:true, trim:true},
		username : {type:String, required:true,	unique:true, trim:true},
		password : {type:String, required: true},
	},
	{collection: "user_table"}
);


//check password
UserSchema.statics.passwordCheck = (user_username, user_password, callback) => {
	User.findOne({username: user_username}).exec((error, db_user) => {

		//if error or user table from database doesn't exist 
		if(error || !db_user){
			return callback(false);
		}

		bcrypt.compare(user_password, db_user.password, function(err, res) {
		    //return true or false
		    return callback(res);
		});
	});
}


//get profile data
UserSchema.statics.getProfileData = (username, callback) => {
	User.findOne({username: username}).exec((error, db_user) => {

		//if error or user table from database doesn't exist 
		if(error || !db_user){
			return callback(false);
		}
	    return callback(db_user);
	});
}


//hashing password before stored into database
UserSchema.pre('save', function (next) {
	//use user's schema
	let user_schema = this;
	
	//bcrypt hash
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(user_schema.password, salt, (err, hash) => {
			user_schema.password = hash;
			next();
		});
	});
});



//create user model
let User = mongoose.model('User', UserSchema);

module.exports = User;