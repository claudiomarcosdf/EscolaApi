const Observador = require('../observador/observadorModel');
const errorHandler = require('../common/errorHandler');
const auditorHandler = require('../common/auditorHandler');
const multer = require('multer');
const multerConfig = require('../../config/multer');
const removeFile = require('./alunoFileService');

Observador.methods(['get', 'post', 'put', 'patch', 'delete']);

Observador.updateOptions({ new: true, runValidators: true });
Observador.after('post', errorHandler).after('put', errorHandler);
Observador.before('avatar', multer(multerConfig).single('file'));
Observador.before('post', auditorHandler)
  .before('put', auditorHandler)
  .before('delete', auditorHandler);


//prettier-ignore (http://localhost:3003/api/observadores/avatar?id=)
Observador.route('avatar', ['post'], (req, res, next) => {
  const id = req.query.id;
  const url = `${process.env.APP_URL}/files/`; 
  const name = req.file.key;

  (async () => {
    try {
      const observadorData = await getDadosPessoais(id);
      const newDadosPessoais = {
        ...observadorData.toJSON(),
        avatar_url: url,
        avatar_nome: name,
      };

      //Se existir avatar, remove antes
      if (observadorData.avatar_nome) {
        if(observadorData.avatar_nome !== '') {
          removeFile(observadorData.avatar_nome);
        }
      }

      const observadorUpdated = await Observador.findByIdAndUpdate(
        { _id: id },
        { dados_pessoais: newDadosPessoais },
        { new: true }
      );

      if (!observadorUpdated) {
        res.status(404).json({ errors: ['Erro ao adicionar foto.'] });
      } else {
        res.status(200).json(observadorUpdated);
      }
    } catch (error) {
      res.status(404).json({ errors: [error] });
    }
  })();
});

const getDadosPessoais = async (id) => {
  const projections = { _id: 0, dados_pessoais: 1 };
  const data = await Observador.findById(id, projections);

  return data.dados_pessoais;
};

module.exports = Observador;