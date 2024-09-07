const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Auth API',
    description: 'Authentication related endpoints',
  },
  host: 'localhost:5000',
  basePath: '/api/auth',
  schemes: ['http'],
};

const outputFile = './src/swagger/swagger-auth-output.json';
const endpointsFiles = ['./src/routes/authRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
