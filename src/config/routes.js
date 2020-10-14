const express = require('express');
const AlunoRouter = require('../api/service/alunoService');
const TabelaComportamentoRouter = require('../api/service/tabelaComportamentoService');

module.exports = function (server) {
  //URL Base
  const router = express.Router();
  server.use('/api', router);

  //Rotas do Aluno
  AlunoRouter.register(router, '/alunos');
  //Rotas Tabela de Comportamento
  TabelaComportamentoRouter.register(router, '/tabela-comportamento');
};
