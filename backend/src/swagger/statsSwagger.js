const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Stats API',
    description: 'Statistics related endpoints',
  },
  host: 'localhost:5000',
  basePath: '/api/stats',
  schemes: ['http'],
};

const outputFile = './src/swagger/swagger-stats-output.json';
const endpointsFiles = ['./src/routes/statsRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
