//A variável Aluno já vem com os métodos do mongoose e do restful
const Aluno = require('../aluno/alunoModel');
const TabelaComportamento = require('../comportamento/tabelaComportamentoModel');
const errorHandler = require('../common/errorHandler');
const auditorHandler = require('../common/auditorHandler');

Aluno.methods(['get', 'post', 'put', 'patch', 'delete']);
Aluno.updateOptions({ new: true, runValidators: true });
Aluno.after('post', errorHandler).after('put', errorHandler);
Aluno.before('post', auditorHandler)
  .before('put', auditorHandler)
  .before('delete', auditorHandler);

//detail: true -> detail routes operate on a single instance, i.e. /user/:id
//TESTAR A FUNÇÃO PUSH E PULL DO MONGOOSE PARA INSERIR E EXCLUIR UM DOCUMENTO
// NO SUBDOCUMENTO:doc.subdocs.push({ _id: 4815162342 })
//  doc.subdocs.pull({ _id: 4815162342 }) // removed

Aluno.route('count', (req, res, next) => {
  Aluno.countDocuments((error, value) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      res.status(200).json({ value });
    }
  });
});

Aluno.route('ocorrencia', ['post'], (req, res, next) => {
  const id = req.query.id; //Id do Aluno
  const newOcorrencia = req.body;

  (async () => {
    try {
      const data = await getOcorrenciasAndComportamento(id);
      const ocorrencias = data.ocorrencias;
      const comportamento = data.comportamento;

      const isPresent = ocorrenciaExists(ocorrencias, newOcorrencia);

      if (isPresent) {
        res.status(404).json({ errors: ['Ocorrência já cadastrada.'] });
      } else {
        //Adicionar Ocorrência
        const ocorrenciasToAdd = [...ocorrencias, newOcorrencia];
        const valueNewOcorrencia = newOcorrencia.valor;
        let newComportamento = { status: '', pontuacao: 0 };

        newComportamento.pontuacao = pontuacaoToCalc(
          newOcorrencia.conduta,
          comportamento.pontuacao,
          valueNewOcorrencia
        );

        //Buscar na collection tabela-comportamento a classificacao referente à pontuacao
        newComportamento.status = await getNewStatus(
          newComportamento.pontuacao
        );

        const alunoUpdated = await Aluno.findByIdAndUpdate(
          { _id: id },
          { ocorrencias: ocorrenciasToAdd, comportamento: newComportamento },
          { new: true }
        );

        if (!alunoUpdated) {
          res.status(404).json({ errors: ['Erro ao adicionar ocorrência.'] });
        } else {
          res.status(200).json(alunoUpdated);
        }
      }
    } catch (error) {
      res.status(404).json({ errors: [error] });
    }
  })();

  // getOcorrencias(id)
  //   .then((ocorrencias) => res.json(ocorrencias))
  //   .catch((error) => res.status(404).json({ errors: ['error.message'] }));

  //Aluno.findOneAndUpdate({ _id: id }, req.body);
});

const pontuacaoToCalc = (conduta, pontuacaoAtual, newValue) => {
  let newPontuacao = 0;
  if (conduta === 'NEGATIVA') {
    newPontuacao = pontuacaoAtual - newValue;
    if (newPontuacao < 0) {
      newPontuacao === 0;
    }
  } else {
    newPontuacao = pontuacaoAtual + newValue;
    if (newPontuacao > 10) {
      newPontuacao === 10;
    }
  }
  return newPontuacao;
};

const ocorrenciaExists = (ocorrencias, newOcorrencia) => {
  const exists = ocorrencias.some((ocorrencia) => {
    const { data, fato_observado, conduta, medida, valor } = ocorrencia;

    const ocorrenciaToCompare = {
      data,
      fato_observado,
      conduta,
      medida,
      valor,
    };

    return (
      JSON.stringify(ocorrenciaToCompare) === JSON.stringify(newOcorrencia)
    );
  });

  return exists;
};

const getOcorrenciasAndComportamento = async (id) => {
  const projections = { _id: 0, ocorrencias: 1, comportamento: 1 };
  const ocorrencias = await Aluno.findById(id, projections);

  return ocorrencias;
};

Aluno.route('ocorrencia', ['get'], (req, res, next) => {
  const id = req.query.idAluno; //Id do Aluno
  const projections = { _id: 0, ocorrencias: 1 };

  Aluno.findById(id, projections, (error, data) => {
    if (error) {
      res.status(404).json({ errors: [error] });
    } else {
      res.status(200).json(data);
    }
  });
});

Aluno.route('ocorrencia', ['delete'], (req, res, next) => {
  const id = req.query.id; //id da ocorrência

  (async () => {
    //fazer busca por id da ocorrencia
    const data = await Aluno.findOne({ 'ocorrencias._id': id });
    const comportamento = data.comportamento;
    const ocorrencias = data.ocorrencias;
    const idAluno = data._id;

    if (!data) {
      res.status(500).json('Id não encontrado');
    } else {
      //pegar a ocorrencia do aluno retornado
      const ocorrenciaToRemove = ocorrencias.find(
        (item) => JSON.stringify(item._id) === JSON.stringify(id)
      );
      const valueToRemove = ocorrenciaToRemove.valor;
      const conduta = ocorrenciaToRemove.conduta;

      let newComportamento = { status: '', pontuacao: 0 };

      //estornar valor para a pontuacao do comportamento
      if (conduta === 'NEGATIVA') {
        newComportamento.pontuacao = comportamento.pontuacao + valueToRemove;
      } else if (conduta === 'POSITIVA') {
        newComportamento.pontuacao = comportamento.pontuacao - valueToRemove;
      }

      //Buscar na collection tabela-comportamento a classificacao referente à pontuacao
      newComportamento.status = await getNewStatus(newComportamento.pontuacao);

      //no array ocorrencias filtrar todas ocorrencias EXCETO a que será removida do array
      const ocorrenciasToSave = ocorrencias.filter(
        (item) => JSON.stringify(item._id) !== JSON.stringify(id)
      );
      //fazer um update no Aluno passando o novo array com as novas ocorrencias filtradas
      const alunoUpdated = await Aluno.findOneAndUpdate(
        { _id: idAluno },
        { ocorrencias: ocorrenciasToSave, comportamento: newComportamento },
        { new: true }
      );

      if (!alunoUpdated) {
        res.status(404).json({ errors: ['Erro ao excluir ocorrência.'] });
      } else {
        res.status(200).json(alunoUpdated);
      }
    }
  })();
});

const getNewStatus = async (pontuacao) => {
  const tabelaComportamento = await TabelaComportamento.findOne({
    grau_inicial: { $lte: pontuacao },
    grau_final: { $gte: pontuacao },
  });

  return tabelaComportamento.classificacao;
};

Aluno.route('comportamento', (_, res, next) => {
  const projections = { comportamento: 1 };
  Aluno.find({}, projections, (error, data) => {
    if (error) {
      res.status(404).json({ errors: [error] });
    } else {
      res.status(200).json(data);
    }
  });
});

Aluno.route('resumeocorrencias', (_, res, next) => {
  const atualDate = new Date(new Date().setUTCHours(0, 0, 0, 0));

  let startToday = new Date(new Date().setUTCHours(0, 0, 0, 0));
  let endToday = new Date(new Date().setUTCHours(0, 0, 0, 0));
  //prettier-ignore
  let startCurrentMonth = new Date(new Date(atualDate.getFullYear(), atualDate.getMonth(), 1).setUTCHours(0, 0, 0, 0));
  //prettier-ignore
  let endCurrentMonth = new Date(new Date(atualDate.getFullYear(), atualDate.getMonth()+1, 0).setUTCHours(0, 0, 0, 0));
  //prettier-ignore
  let startCurrentYear = new Date(new Date(atualDate.getFullYear(), 1 - 1, 1).setUTCHours(0, 0, 0, 0));
  //prettier-ignore
  let endCurrentYear = new Date(new Date(atualDate.getFullYear(), 12 - 1, 31).setUTCHours(0, 0, 0, 0));

  (async () => {
    try {
      //prettier-ignore
      const qtdeOcorrenciasDia = await getTotalOcorrenciasPeriodo(startToday, endToday);
      //prettier-ignore
      const qtdeOcorrenciasMes = await getTotalOcorrenciasPeriodo(startCurrentMonth, endCurrentMonth);
      //prettier-ignore
      const qtdeOcorrenciasAno = await getTotalOcorrenciasPeriodo(startCurrentYear, endCurrentYear);

      res.status(200).json({
        occurrencesPerDay: qtdeOcorrenciasDia,
        occurrencesPerMonth: qtdeOcorrenciasMes,
        occurrencesPerYear: qtdeOcorrenciasAno,
      });
    } catch (error) {
      res.status(500).json({ errors: [error] });
    }
  })();
});

Aluno.route('countocorrencias', (req, res, next) => {
  const initialDate = req.query.initialDate;
  const finalDate = req.query.finalDate;

  let startDate = new Date();
  let endDate = new Date();

  if (initialDate && finalDate) {
    startDate = new Date(initialDate);
    endDate = new Date(finalDate);
  } else {
  }
  (async () => {
    try {
      const qtde = await getTotalOcorrenciasPeriodo(startDate, endDate);

      res.status(200).json({ value: qtde });
    } catch (error) {
      res.status(500).json({ errors: [error] });
    }
  })();
});

const getTotalOcorrenciasPeriodo = async (startDate, endDate) => {
  const projections = { _id: 0, ocorrencias: 1 };
  const data = await Aluno.find({}, projections);
  let ocorrencias = [];

  const allOcorrencias = data
    .map((student) => {
      return student.ocorrencias;
    })
    .forEach((arrayOcorrencias) => {
      arrayOcorrencias.forEach((objectsOcorrencia) =>
        ocorrencias.push(objectsOcorrencia)
      );
    });

  const total = ocorrencias.filter(
    (ocorrencia) => ocorrencia.data >= startDate && ocorrencia.data <= endDate
  );

  return total.length;
};

// Aluno.route('sumary', (req, res, next) => {
//   Aluno.aggregate({
//     $project: {},
//   });
// });

//Caso a rota GET não funcione descomentar:
// Aluno.route('get', (req, res, next) => {
//   Aluno.find({}, (err, docs) => {
//     if (!err) {
//       res.json(docs);
//     } else {
//       res.status(500).json({ errors: [error] });
//     }
//   });
// });

module.exports = Aluno;
