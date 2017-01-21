var express = require('express');
var router = express.Router();

var passport = require('passport');

require('../configs/passport.js')(passport);

router.post('/login', 
    passport.authenticate('local'),
    function(req, res) {
        return res.status(200).send();
    });

router.get('/loggedIn', 
    function(req, res) {
        return res.status(200).send({ loggedIn: !!req.user});
    });

router.post('/logout', function(req, res){
    req.logout();
    return res.status(200).send();
});

module.exports.index = router;