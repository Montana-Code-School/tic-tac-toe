var Game = require("./models/game")
module.exports = function(app, passport){
  function notImplemented(req, res){
    res.json({status : "not implemented"})
  }
  //app.get is handling our http request.
  app.get("/", function (req,res){
    res.render("index");
  })

  //this will get the json object that has information on our current games

  app.route("/api/games")
     .get(notImplemented)
     .post(function(req, res){ //creating a game
      new Game({playerX : req.body.playerX, playerO : req.body.playerO})
      .save(function(error,data){
        res.json(data)
      })
     })

  app.route("/api/games/:gameId")
     .get(notImplemented)
     .put(function(req,res){
       var gameId = req.params.gameId;
       var move = req.body.move;
       Game.findOne({_id:gameId}, function(error, game){
         game.board[move] = game.playerX_turn ? "x" : "o";
         game.playerX_turn = !game.playerX_turn;
         game.save(function(error,savedGame) {
           if(savedGame.winGame()){
              res.json({"status": "Player " + game.winner + " wins"})
           } else if(savedGame.emptySquares()){
              res.json(savedGame)
           } else {
              res.json({"status": "Game Over"})
           }

         })
       })

     })
     .delete(notImplemented);
     // =====================================
         // LOGIN ===============================
         // =====================================
         // show the login form
         app.get('/login', function(req, res) {

             // render the page and pass in any flash data if it exists
             res.render('login.ejs', { message: req.flash('loginMessage') });
         });

         // process the login form
         app.post('/login', passport.authenticate('local-login', {
             successRedirect : '/profile', // redirect to the secure profile section
             failureRedirect : '/login', // redirect back to the signup page if there is an error
             failureFlash : true // allow flash messages
         }));

         // process the login form
         // app.post('/login', do all our passport stuff here);

         // =====================================
         // SIGNUP ==============================
         // =====================================
         // show the signup form
         app.get('/signup', function(req, res) {

             // render the page and pass in any flash data if it exists
             res.render('signup.ejs', { message: req.flash('signupMessage') });
         });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
        }));

         // process the signup form
         // app.post('/signup', do all our passport stuff here);

         // =====================================
         // PROFILE SECTION =====================
         // =====================================
         // we will want this protected so you have to be logged in to visit
         // we will use route middleware to verify this (the isLoggedIn function)
         app.get('/profile', isLoggedIn, function(req, res) {
             res.render('profile.ejs', {
                 user : req.user // get the user out of session and pass to template
             });
         });

         // =====================================
         // LOGOUT ==============================
         // =====================================
         app.get('/logout', function(req, res) {
             req.logout();
             res.redirect('/');
         });
     };

     // route middleware to make sure a user is logged in
     function isLoggedIn(req, res, next) {

         // if user is authenticated in the session, carry on
         if (req.isAuthenticated())
             return next();

         // if they aren't redirect them to the home page
         res.redirect('/');
     }
