const restful = require('node-restful');
const mongoose = restful.mongoose;

const tabelaComportamentoSchema = new mongoose.Schema({
  classificacao: {
    type: String,
    required: true,
    enum: ['Excepcional', 'Ótimo', 'Bom', 'Regular', 'Insuficiente', 'Mau'],
  },
  grau_inicial: { type: Number, required: true, min: 0.0, max: 10.0 },
  grau_final: { type: Number, required: true, min: 0.0, max: 10.0 },
});

module.exports = restful.model(
  'tabela-comportamento',
  tabelaComportamentoSchema,
  'tabela-comportamento'
);
