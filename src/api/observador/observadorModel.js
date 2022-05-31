const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const endereco = {
  endereco: { type: String },
  cidade: { type: String },
  uf: { type: String },
  cep: { type: String },
};

const contatos = {
  responsavel: { type: String },
  celular_resp1: { type: String },
  responsavel2: { type: String },
  celular_resp2: { type: String },
};

const dadosPessaisSchema = new mongoose.Schema({
  cpf: { type: String, unique: true, required: true },
  rg: { type: String },
  email: { type: String },
  residencia: { type: endereco },
  contatos: { type: contatos },
  avatar_url: { type: String },
  avatar_nome: { type: String },
});

const observadorSchema = new mongoose.Schema({
  matricula: {
    type: String,
    minlength: 4,
    maxlength: 20,
    unique: 'A matrícula {VALUE} já cadastrada.',
    required: true,
  },
  nome: { type: String, required: true },
  genero: { type: String, enum: ['M', 'F'] },
  data_nascimento: { type: Date, required: true },
  telefone: { type: String, required: true },
  dados_pessoais: { type: dadosPessaisSchema },
  situacao: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
});

observadorSchema.plugin(beautifyUnique);
module.exports = restful.model('observador', observadorSchema);