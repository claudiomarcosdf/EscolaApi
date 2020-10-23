const express = require('express');
const auth = require('./auth');
const AlunoRouter = require('../api/service/alunoService');
const TabelaComportamentoRouter = require('../api/service/tabelaComportamentoService');
const TabelaMedidaRouter = require('../api/service/tabelaMedidaService');
const TabelaTransgressaoRouter = require('../api/service/tabelaTransgressaoService');

module.exports = function (server) {
  /* Rotas protegidas por Token JWT */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);
  protectedApi.use(auth);

  //Rotas do Aluno
  AlunoRouter.register(protectedApi, '/alunos');
  //Rotas Tabela de Comportamento
  TabelaComportamentoRouter.register(protectedApi, '/tabela-comportamento');
  //Rotas Tabela de Medida
  TabelaMedidaRouter.register(protectedApi, '/tabela-medida');
  //Rotas Tabela de Transgressao
  TabelaTransgressaoRouter.register(protectedApi, '/tabela-transgressao');

  /* Rotas abertas */
  const openApi = express.Router();
  server.use('/oapi', openApi);

  const AuthService = require('../api/service/authService');
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
  openApi.post('/validateToken', AuthService.validateToken);
};
