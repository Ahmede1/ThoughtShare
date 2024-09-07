const fs = require('fs');

const authSwagger = require('./swagger-auth-output.json');
const userSwagger = require('./swagger-user-output.json');
const statsSwagger = require('./swagger-stats-output.json');
const newsSwagger = require('./swagger-news-output.json');

function addBasePathToPaths(swaggerDoc, basePath) {
  const updatedPaths = {};
  for (const [path, value] of Object.entries(swaggerDoc.paths)) {
    updatedPaths[`${basePath}${path}`] = value;
  }
  return updatedPaths;
}

const combinedSwagger = {
  ...authSwagger,
  basePath: '/api', // Set a common base path for the combined documentation
  paths: {
    ...addBasePathToPaths(authSwagger, '/auth'),
    ...addBasePathToPaths(userSwagger, '/users'),
    ...addBasePathToPaths(statsSwagger, '/stats'),
    ...addBasePathToPaths(newsSwagger, '/news'),
  },
  definitions: {
    ...authSwagger.definitions,
    ...userSwagger.definitions,
    ...statsSwagger.definitions,
    ...newsSwagger.definitions,
  }
};

// Remove the basePath from each individual swagger doc to avoid duplication
// delete combinedSwagger.basePath;

fs.writeFileSync('./src/swagger-output.json', JSON.stringify(combinedSwagger, null, 2));
