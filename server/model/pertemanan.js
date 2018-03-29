//include modules
const mongoose = require('mongoose');

//create pertemanan's schema
let PertemananSchema = new mongoose.Schema({
	//fkIdPertemanan : {type:mongoose.Schema.Types.ObjectId, required:true, unique:true, ref:'User'},
	fullname : {type:String, required:true},
	email 	 : {type:String, required:true,	unique:true, trim:true},
	username : {type:String, required:true,	unique:true, trim:true},
	userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
},{collection: "pertemanan_table"});


//create pertemanan model
let Pertemanan = mongoose.model('Pertemanan', PertemananSchema);

module.exports = Pertemanan;