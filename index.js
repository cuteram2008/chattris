var express  = require('express');
var app      = express();
var server = require('http').Server(app);
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var io = require('socket.io')(server);
mongoose.connect(configDB.url);
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser());
app.use('/views',  express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'mydearcomputerpleasestopstoppingaftergettingoverheatedcauseitstressesmeout' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./app/routes.js')(app, passport);
require('./config/passport')(passport, io);
var nothing = [];
var messages = [];
var pmessages = [];
var usernames = {};
var storem = function(name, data){
	messages.push({name: name, data: data});
	if(messages.length > 20){
		messages.shift();
	}
};

var storepm = function(to, from, msg){
	pmessages.push({to: to, from: from, msg: msg});
	if(pmessages.length > 20){
		pmessages.shift();
	}
};
io.on('connection', function(socket){
	socket.on('join', function(data){
		socket.nick = data;
		usernames[data] = data;
		console.log(usernames);
		storem('Server', data + ' has joined the chat');
		io.emit('userjoino', usernames)
		messages.forEach(function(message){
			socket.emit('messages', message.name + ': ' + message.data);
		});
		pmessages.forEach(function(message){
			socket.emit('whisper', {user: message.to, whisp: message.msg, sender: message.from});
		});
	});
	socket.on('message', function(data){
		var msgob = [socket.nick + ': ' + data];
		storem(socket.nick, data);
		socket.broadcast.emit('messages', msgob);
	});
	socket.on('disconnect', function(){
		socket.broadcast.emit('disuser', socket.nick);
		delete usernames[socket.nick];
		console.log(usernames);
		io.emit('userjoino', usernames);
		
	});

	socket.on('whisper', function(data){
		storepm(data.user, data.sender, data.whisp)
		io.emit('whisper', {user: data.user, whisp: data.whisp, sender: data.sender});
	});
	socket.on('search', function(data){
		var search = require('./dpassport');
		search.search(data.query, function(docs){
			if (typeof docs[0] === 'undefined'){
				socket.emit('searchfalse', docs);
				console.log('no');
			}else{

				socket.emit('search', {id: docs[0]._id, user: docs[0].local.email});
				console.log(docs);
			}
		});


	});
});

server.listen(8080);