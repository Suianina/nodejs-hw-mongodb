require('dotenv').config();
const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();
