const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const endereco = {
  endereco: { type: String },
  cidade: { type: String },
  uf: { type: String },
  cep: { type: String },
};

const dadosPessaisSchema = new mongoose.Schema({
  cpf: { type: String, unique: true, required: true },
  rg: { type: String },
  email: { type: String },
  residencia: { type: endereco },
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
  funcao: { type: String },
  dados_pessoais: { type: dadosPessaisSchema },
  situacao: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createAt: { type: Date, required: true, default: Date.now }
});

observadorSchema.plugin(beautifyUnique);
module.exports = restful.model('observadores', observadorSchema, 'observadores');