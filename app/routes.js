module.exports = function(app, passport) {
	app.get('/', isAuthenticated, function(req, res){
		res.render('index.ejs');
	});

	app.get('/login', isAuthenticated, function(req, res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	app.get('/signup', isAuthenticated, function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});
	app.get('/profile',isLoggedIn, function(req, res){
		res.render('profile.ejs', {user: req.user});
	});
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true 
    }));


};
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
		console.log('Yay!');
	}else{
		res.redirect('/login');
	}
}

function isAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect('/profile');	
	}else{
		return next();
	}
}