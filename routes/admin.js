const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {conferAdmin} = require("../helpers/conferAdmin")

    router.get('/', conferAdmin, (req, res) => {
        res.render("admin/index")
    })

//Inicio das rotas de categoria
    router.get('/categorias', conferAdmin, (req, res) => {
        Categoria.find().sort({data: 'desc'}).then((categorias) => {
            res.render("admin/categorias", {categorias: categorias})
        }).catch((err) => {
            res.flash("msg_error", "Erro ao listar categorias, tente novamente!")
            res.redirect("/admin")
        })
    })

    router.get('/categorias/add', conferAdmin, (req, res) => {
        res.render("admin/addcategorias")
    })

    router.post('/categorias/nova', conferAdmin, (req, res) => {
        
        var erros = []
        
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({texto: "Nome inválido!"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({texto: "Slug inválido!"})
        }

        if(req.body.nome.length < 2) {
            erros.push({texto: "Nome da categoria é muito pequeno!"})
        }

        if(erros.length > 0){
            res.render("admin/addcategorias", {erros: erros})
        }else{
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }

            new Categoria(novaCategoria).save().then(() => {
                req.flash("msg_success", "Categoria criada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("msg_error", "Falha ao criar categoria, tente novamente!")
                res.redirect("/admin")
            })
        }
    })

    router.get("/categorias/edit/:id", conferAdmin, (req, res) => {
        Categoria.findOne({_id:req.params.id}).then((categoria) => {
            res.render("admin/editcategorias", {categoria: categoria})
        }).catch((err) => {
            req.flash("msg_error", "Categoria não encontrada, verifique e tente novamente!")
            res.redirect("/admin/categorias")
        })
    })

    router.post("/categorias/edit", conferAdmin, (req, res) => {
        Categoria.findOne({_id:req.body.id}).then((categoria) => {
            
            categoria.nome = req.body.nome,
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("msg_success", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("msg_error", "Erro ao salvar a edição da categoria, tente novamente!")
                res.redirect("/admin/categorias")
            })

        }).catch((err) => {
            req.flash("msg_error", "Erro ao editar a categoria, tente novamente!")
            res.redirect("/admin/categorias")
        })
    })

    router.post("/categorias/del", conferAdmin, (req, res) => {
        Categoria.remove({_id:req.body.id}).then(() => {
            req.flash("msg_success", "Categoria excluida com suceeso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("msg_error", "Erro ao excluir categoria, verifique e tente novamente!")
            res.redirect("/admin/categorias")
        })
    })  
//Fim das Rotas de Categoria

//Inicio das Rotas de Postagens
    router.get('/postagens', conferAdmin, (req, res) => {
        Postagem.find().populate("categoria").sort({data: 'desc'}).then((postagens) => {
            res.render("admin/postagens", {postagens: postagens})
        }).catch((err) => {
            res.flash("msg_error", "Erro ao listar categorias, tente novamente!")
            res.redirect("/admin")
        })
    })

    router.get('/postagens/add', conferAdmin, (req, res) => {
        Categoria.find().then((categorias) => {
            res.render("admin/addpostagens", {categorias: categorias})
        }).catch((err) => {
            req.flash("msg_flash", "Erro ao carregar o formuláario, tente novamente!")
            res.redirect("/admin")
        })
    })

    router.post('/postagens/nova', conferAdmin, (req, res) => {
        
        var erros = []
        
        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
            erros.push({texto: "O título da postagem deve ser preenchido!"})
        }

        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({texto: "O slug da postagem deve ser preenchido!"})
        }

        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            erros.push({texto: "A descrição da postagem deve ser preenchida!"})
        }

        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
            erros.push({texto: "O conteúdo da postagem deve ser preenchido!"})
        }

        if(req.body.categoria == "0"){
            erros.push({texto: "Categoria inválida!"})
        }

        if(req.body.titulo.length < 2) {
            erros.push({texto: "O título da postagem é muito pequeno!"})
        }

        if(req.body.descricao.length < 5) {
            erros.push({texto: "A descriçãao da postagem é muito pequena!"})
        }

        if(req.body.conteudo.length < 5) {
            erros.push({texto: "O conteúdo da postagem é muito pequeno!"})
        }

        if(erros.length > 0){
            res.render("admin/addpostagens", {erros: erros})
        }else{
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash("msg_success", "Postagem criada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("msg_error", "Falha ao criar postagem, tente novamente!")
                res.redirect("/admin/postagens")
            })
        }
    })

    router.get("/postagens/edit/:id", conferAdmin, (req, res) => {
        Postagem.findOne({_id:req.params.id}).then((postagem) => {
            Categoria.find().then((categorias) => {
                res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
            })
        }).catch((err) => {
            req.flash("msg_error", "Categoria não encontrada, verifique e tente novamente!")
            res.redirect("/admin/postagens")
        })
    })
    
    router.post("/postagens/edit", conferAdmin, (req, res) => {
        Postagem.findOne({_id:req.body.id}).then((postagem) => {
            
            postagem.titulo = req.body.titulo,
            postagem.descricao = req.body.descricao,
            postagem.conteudo = req.body.conteudo,
            postagem.categoria = req.body.categoria

            postagem.save().then(() => {
                req.flash("msg_success", "Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("msg_error", "Erro ao salvar a edição da postagem, tente novamente!")
                res.redirect("/admin/postagens")
            })

        }).catch((err) => {
            req.flash("msg_error", "Erro ao editar a postagem, tente novamente!")
            res.redirect("/admin/postagens")
        })
    })

    router.post("/postagens/del", conferAdmin, (req, res) => {
        Postagem.remove({_id:req.body.id}).then(() => {
            req.flash("msg_success", "Postagem excluida com suceeso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("msg_error", "Erro ao excluir postagem, verifique e tente novamente!")
            res.redirect("/admin/postagens")
        })
    })  

module.exports = router