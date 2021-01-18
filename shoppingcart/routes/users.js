var express = require("express");
var router = express.Router();
var passport = require('passport')
var bcrypt = require('bcryptjs')
const { check, oneOf, validationResult } = require('express-validator')


const Users = require("../models/user")

//get register /
router.get('/register', (req,res) => {

    res.render("register", {
        title: "Register"

    })

});

//post register

router.post('/register', [
    check('name')
        .exists({ checkFalsy: true, checkNull: true }).withMessage("Name is required"),
    check('email')
        .exists({ checkFalsy: true, checkNull: true }).withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid e-mail address."),
    check("username")
        .exists({ checkFalsy: true, checkNull: true }).withMessage("Username is required"),
    check("password").exists({ checkFalsy: true, checkNull: true }).withMessage("Password is required"),
    check("password2").exists({ checkFalsy: true, checkNull: true }).withMessage("Password confirmation is required").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true;
    })
], (req, res) => {

    var errors = validationResult(req);
    extractederrors = []
    errors.array().map(err => extractederrors.push(err.msg));

    if (extractederrors.length) {
        res.render('register', {
            errors: extractederrors,
            title: 'Register',
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            users: null
        })
    } else {
        Users.findOne({ username: req.body.username }, (err, user) => {
            if (err) console.log(err)
            if (user) {
                req.flash('danger', "Username exists, please choose another.")
                res.redirect("/users/register");
            } else {
                var user = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    admin: 0
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) console.log(err)
                        user.password = hash;

                        user.save((err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                req.flash('success', "You are now registered!")
                                res.redirect("/users/login")
                            }
                        });
                    });
                });
            }
        });
    }
});
   
//get login
router.get('/login', (req,res) => {

   if(res.locals.users) res.redirect('/');

   res.render('login', {
       title: "Login"
   })

});


//post login
router.post('/login', (req,res, next) => {

  passport.authenticate('local', {
      successRedirect:"/",
      failureRedirect: "/users/login",
      failureFlash: "Please enter a valid username and password combination."
     
  }) (req, res, next);
 
 });
 
//get register /
router.get('/logout', (req,res) => {

  req.logout();

  req.flash('success',"You are now logged out!");
  res.redirect('/users/login');

});


//exports

module.exports = router


