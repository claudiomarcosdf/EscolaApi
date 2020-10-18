const restful = require('node-restful');
const mongoose = restful.mongoose;

const tabelaMedidaSchema = new mongoose.Schema({
  medida: {
    type: String,
    required: true,
    enum: [
      'Advertência verbal',
      'Advertência escrita',
      'Repreensão',
      'Estudo orientado',
      'Suspensão',
      'Elogio coletivo',
      'Elogio individual',
      'Aprovação por média sem recuperação',
      'Aprovação por média com recuperação',
      'Reprovação',
    ],
  },
  tipo_conduta: {
    type: String,
    required: true,
    enum: ['NEGATIVA', 'POSITIVA', 'NEUTRA'],
  },
  valor: {
    type: Number,
    required: true,
    min: 0.0,
    max: 10.0,
  },
});

module.exports = restful.model(
  'tabela-medida',
  tabelaMedidaSchema,
  'tabela-medida'
);
