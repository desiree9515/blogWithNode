//Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const usuarios = require("./routes/user")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")

//Configurações
    //Sessão
    app.use(session({
        secret: "myBlogNode$",
        resave: true,
        saveUninitialized: true
    }))
    //Config do passport
    app.use(passport.initialize())
    app.use(passport.session())
    //Flash - tem que estar abaixo da sessao
    app.use(flash())
    //Middleware *variaveis globais*
    app.use((req, res, next) => {
        res.locals.msg_success = req.flash("msg_success")
        res.locals.msg_error = req.flash("msg_error")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next();
    })
    //Body Parser
    app.use(bodyParse.urlencoded({extended: true}))
    app.use(bodyParse.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(db.mongoURI, {useNewUrlParser: true}).then(() => {
        console.log("Conectado ao mongoDB!")
    }).catch((err) => {
        console.log("Erro ao se conectar ao mongoDB! "+err)
    })
    //Public
    app.use(express.static(path.join(__dirname, "public")))
    //Rotas
    app.get('/categorias',(req, res) => {
        Categoria.find().sort({data: 'desc'}).then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            res.flash("msg_error", "Erro ao listar categorias, tente novamente!")
            res.redirect("/404")
        })
    })

    app.get("/categorias/:slug", (req,res) => {
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria:categoria})
                }).catch((err) => {
                    req.flash("msg_error", "Nenhuma postagem desta categoria encontrada, tente novamente!")
                    res.redirect("/")
                })
            }else{
                req.flash("msg_error", "Categoria inexistente, tente novamente!")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("msg_error", "Erro interno ao tentar encontrar categoria, tente novamente!")
            res.redirect("/")
        })
    })
    
    app.get('/',(req, res) => {
        Postagem.find().populate("categoria").sort({data: 'desc'}).then((postagens) => {
            res.render("homepage", {postagens: postagens})
        }).catch((err) => {
            req.flash("msg_error", "Erro ao listar categorias, tente novamente!")
            res.redirect("/404")
        })
    })

    app.get("/postagens/:slug", (req, res) => {
        Postagem.findOne({slug:req.params.slug}).then((postagens) => {
            if(postagens){
                res.render("postagens/index", {postagens: postagens})
            }else{
                req.flash("msg_error", "Postagem não encontrada, tente novamente!")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("msg_error", "Erro interno!")
            res.redirect("/")
        })
    })

    app.get("/404", (req, res) => {
        res.send("Erro 404!")
    })

     app.use('/admin', admin)
     app.use("/usuarios", usuarios)
//Outros
const PORT =  process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando ... ")
})