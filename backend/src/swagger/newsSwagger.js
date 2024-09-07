const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'News API',
    description: 'News related endpoints',
  },
  host: 'localhost:5000',
  basePath: '/api/news',
  schemes: ['http'],
};

const outputFile = './src/swagger/swagger-news-output.json';
const endpointsFiles = ['./src/routes/newsRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
