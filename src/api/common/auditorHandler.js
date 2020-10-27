const Auditor = require('../auditor/auditorModel');

module.exports = (req, res, next) => {
  console.log(req.method);
  console.log(req.url);
  console.log(req.query);
  console.log(req.decoded.email);

  next();
};
