const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'User API',
    description: 'User related endpoints',
  },
  host: 'localhost:5000',
  basePath: '/api/users',
  schemes: ['http'],
};

const outputFile = './src/swagger/swagger-user-output.json';
const endpointsFiles = ['./src/routes/userRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
