const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Customizando mensagens de erro do MongoDB
mongoose.Error = require('./messagesError');

const DB_CONNECTION = process.env.MONGODB_CONNECTION;

const db = (async () => {
  try {
    await mongoose.connect(DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();

module.exports = db;
