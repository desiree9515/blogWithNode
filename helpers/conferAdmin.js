module.exports = {
    conferAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.conferAdmin == 1) {
            return next();
        }
        req.flash("msg_error", "Você deve ser um administrador para acessar esta área!")
        res.redirect("/")
    }
}