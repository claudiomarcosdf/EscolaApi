const restful = require('node-restful');
const mongoose = restful.mongoose;

const auditorSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  data: { type: Date, required: true, default: Date.now },
  tipo_acao: {
    type: String,
    required: true,
    enum: ['POST', 'PUT', 'DELETE'],
  },
  acao: {
    type: String,
    required: true,
  },
});

module.exports = restful.model('auditor', auditorSchema, 'auditor');
