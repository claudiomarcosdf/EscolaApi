const Auditor = require('../auditor/auditorModel');
const _ = require('lodash');

Auditor.methods(['get', 'post']);

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

module.exports = (req, res, next) => {
  const user = req.decoded.email;
  const url = req.url;
  const method = req.method;
  var newCpf = '';

  if (url.includes('alunos') && method === 'POST') {
    if (!url.includes('ocorrencia')) {
      newCpf = `| cpf: ${req.body.dados_pessoais.cpf}`;
    }
  }

  const acao = `${url}  ${newCpf}`;

  const newAuditor = new Auditor({
    usuario: user,
    tipo_acao: method,
    acao: acao,
  });

  newAuditor.save((err) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }
  });

  next();
};
