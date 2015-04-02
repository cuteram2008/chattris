var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./app/models/user');
//var io = require('socket.io');
var search = function(data, callback){
    User.find({ 'local.email': data }, function (err, docs) {
		if(docs[0] === 'undefined'){
			console.log('Aah');
		}  
        if(err){
            callback(err, err ? null : docs);
        }else{
            callback(docs);
        }
    });
};
module.exports.search = search;



