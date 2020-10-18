const express = require('express');
const AlunoRouter = require('../api/service/alunoService');
const TabelaComportamentoRouter = require('../api/service/tabelaComportamentoService');
const TabelaMedidaRouter = require('../api/service/tabelaMedidaService');
const TabelaTransgressaoRouter = require('../api/service/tabelaTransgressaoService');

module.exports = function (server) {
  //URL Base
  const router = express.Router();
  server.use('/api', router);

  //Rotas do Aluno
  AlunoRouter.register(router, '/alunos');
  //Rotas Tabela de Comportamento
  TabelaComportamentoRouter.register(router, '/tabela-comportamento');
  //Rotas Tabela de Medida
  TabelaMedidaRouter.register(router, '/tabela-medida');
  //Rotas Tabela de Transgressao
  TabelaTransgressaoRouter.register(router, '/tabela-transgressao');
};
