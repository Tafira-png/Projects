exports.isUser = function(req, res, next) {

    if(req.isAuthenticated()) {
        next();
    } else{
        req.flash('danger', "Please log in.");
        req.redirect("/users/login")
    }
}


exports.isAdmin = function(req, res, next) {

    if(req.isAuthenticated() && res.locals.users.admin == 1) {
        next();
    } else{
        req.flash('danger', "Please log in as admin.");
        res.redirect("/users/login")
    }
}