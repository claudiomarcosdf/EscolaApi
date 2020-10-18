const restful = require('node-restful');
const mongoose = restful.mongoose;

const tabelaTransgressaoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
  },
  transgressao: {
    type: String,
    required: true,
  },
});

module.exports = restful.model(
  'tabela-transgressao',
  tabelaTransgressaoSchema,
  'tabela-transgressao'
);
