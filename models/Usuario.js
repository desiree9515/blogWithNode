const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    conferAdmin: {
        type: Number,
        default: 0//não é admin
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)