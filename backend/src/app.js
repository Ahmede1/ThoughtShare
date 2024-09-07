const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./middlewares/loggerMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json'); // Path to the generated Swagger JSON file
const statsRoutes = require('./routes/statsRoutes'); // Import stats routes
const tagRoutes = require('./routes/tagRoutes'); // Import tag routes
const videoRoutes = require('./routes/videoRoutes'); // Import video routes
const generalRoutes = require('./routes/generalRoutes'); // Import general routes
const gridFSService = require('./services/gridFSService'); // Import GridFS storage configuration
const paymentRoutes = require('./routes/paymentRoutes'); 
const reportRoutes = require('./routes/reportRoutes'); 
const logRoutes = require('./routes/logRoutes'); 



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware


// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware setup for logging requests
app.use(logger);

// Route setup for authentication and user management
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Route setup for Statitics
app.use('/api/stats', statsRoutes); // Add stats routes


app.use('/api/news', newsRoutes); // Add news routes

app.use('/api/tags', tagRoutes); // Add tag routes 
app.use('/api/videos', videoRoutes); // Add video routes
app.use('/api/general', generalRoutes); // Add general routes


 
app.use('/api/payment', paymentRoutes); // Add payment routes
app.use('/api/users', userRoutes); // Add payment routes
app.use('/api/report', reportRoutes); // Add payment routes
app.use('/api/logs', logRoutes); // Add log routes



// Routes for serving uploaded files
app.get('/image/:fileId', (req, res) => gridFSService.fileRenderer({ ...req, params: { ...req.params, type: 'images' } }, res));
app.get('/video/:fileId', (req, res) => gridFSService.fileRenderer({ ...req, params: { ...req.params, type: 'videos' } }, res));


// Error handling middleware
app.use(errorMiddleware);


// Middleware to log requests with timestamps
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

module.exports = app;
