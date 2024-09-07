const { execSync } = require('child_process');

execSync('node src/swagger/authSwagger.js');
execSync('node src/swagger/userSwagger.js');
execSync('node src/swagger/statsSwagger.js');
execSync('node src/swagger/newsSwagger.js');
execSync('node src/swagger/combineSwagger.js');
