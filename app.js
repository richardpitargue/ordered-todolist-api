require('dotenv/config');

const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const YAML = require('yaml');

const logger = require('./config/logger');
const v1Router = require('./routes/v1');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, PORT } = process.env;

const initializeDb = async () => {
  const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authsource=admin`;
  await mongoose.connect(uri);
};

const app = express();
const port = PORT || 5000;

(async () => {
  try {
    await initializeDb();

    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const file = fs.readFileSync(
      path.resolve(__dirname, 'openapi.yaml'),
      'utf8'
    );
    const openapiSpec = YAML.parse(file);
    app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
    app.use('/spec', (req, res) => {
      res.send(openapiSpec);
      return;
    });

    app.get('/', (req, res) => {
      res.json({ message: 'Ordered Todo List API server is running.' });
      return;
    });

    app.use('/api/v1', v1Router);

    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    logger.error(e);
  }
})();
