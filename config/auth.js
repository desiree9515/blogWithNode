const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


//Validação para salvar usuario
module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario) {
                return done(null, false, {message: "Esta conta não existe"})
            }
                bcrypt.compare(senha, usuario.senha, (erro, confere) => {
                    if(confere) {
                        return done(null, usuario)
                    }else{
                        return done(null, false, {message: "Senha incorreta!"})
                    }
                })
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}