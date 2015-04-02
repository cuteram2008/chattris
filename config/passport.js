var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');
module.exports = function(passport, io) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        
        if(email.length < 0 || password.length < 0){
            return done(null, false, req.flash('loginMessage', 'No field must be left empty'));
        }
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            
            return done(null, user);
            res.redirect('/profile.ejs');
        });

    }));

    


    passport.use('local-signup', new LocalStrategy({
    
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {



        process.nextTick(function() {

        if(email.length < 0 || password.length < 0){
            return done(null, false, req.flash('signupMessage', 'No field must be left empty'));
        }

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That nickname is already taken.'));
            } else {

                var newUser            = new User();


                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    var search = function(data, socket){
        User.find({'local.email' : data}, function(err, docs){
            if(err){
                socket.emit('err', err);
            }
            if(!docs){
                socket.emit('search', {exists: false, result: null});
            }else{
                socket.emit('search', {exists: true, result: docs});
                console.log(docs);
            }
        });
    };

};
