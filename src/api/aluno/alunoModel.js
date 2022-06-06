const restful = require('node-restful');
const mongoose = restful.mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

const ocorrenciaSchema = new mongoose.Schema({
  data: { type: Date, required: true, default: Date.now },
  fato_observado: { type: String, required: true },
  conduta: {
    type: String,
    required: true,
    upperCase: true,
    enum: ['NEGATIVA', 'POSITIVA', 'NEUTRA'],
  },
  medida: { type: String, required: true },
  valor: { type: Number, required: true, min: 0.0, max: 10.0 },
});

const classeSchema = new mongoose.Schema({
  serie: {
    type: String,
    required: true,
    enum: ['Ensino fundamental I', 'Ensino fundamental II', 'Ensino médio'],
  },
  ano: { type: String, required: true },
  turma: { type: String, required: true },
  turno: {
    type: String,
    required: true,
    enum: ['Matutino', 'Vespertino', 'Integral'],
  },
  data_matricula: { type: Date, required: true, default: Date.now },
});

const comportamentoSchema = new mongoose.Schema({
  status: {
    type: String,
    default: 'Bom',
    enum: ['Excepcional', 'Ótimo', 'Bom', 'Regular', 'Insuficiente', 'Mau'],
  },
  pontuacao: { type: Number, min: 0.0, max: 10.0, default: 8 },
});

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

//Ao usar o validate, verifiquei que nas alterações, incluindo o campo Matrícula dá erro
//Então nos updates/PUT não enviar o field Matricula
const alunoSchema = new mongoose.Schema({
  matricula: {
    type: String,
    minlength: 4,
    maxlength: 20,
    unique: 'A matrícula {VALUE} está sendo usada por outro aluno.',
    required: true,
    //   validate: {
    //     validator: function (v) {
    //       return this.model('aluno')
    //         .findOne({ matricula: v })
    //         .then((aluno) => !aluno);
    //     },
    //     message: (props) =>
    //       `A matrícula ${props.value} está sendo usada por outro aluno`,
    //   },
  },
  nome: { type: String, required: true },
  genero: { type: String, enum: ['M', 'F'] },
  data_nascimento: { type: Date, required: true },
  telefone: { type: String, required: true },
  dados_pessoais: { type: dadosPessaisSchema },
  patente: {
    type: String,
    required: true,
    enum: [
      'Cabo aluno',
      '3º Sgt aluno',
      '2º Sgt aluno',
      '1º Sgt aluno',
      'Subtenente aluno',
      'Aspirante aluno',
      '2º tenente aluno',
      'Capitão aluno',
      'Major aluno',
      'Tenente coronel aluno',
      'Coronel aluno',
    ],
  },
  classe: { type: classeSchema },
  comportamento: {
    type: comportamentoSchema,
    default: {},
  },
  ocorrencias: { type: [ocorrenciaSchema] },
  situacao: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
  createAt: { type: Date, required: true, default: Date.now }
});

alunoSchema.plugin(beautifyUnique);
module.exports = restful.model('aluno', alunoSchema);
