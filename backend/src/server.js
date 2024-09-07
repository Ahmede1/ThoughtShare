require('dotenv').config(); // Load environment variables from .env file
const http = require('http');
const app = require('./app');
const connectDB = require('./db/connect');
const config = require('config');

const PORT = process.env.PORT || config.get('PORT'); // Define the port to run the server

const server = http.createServer(app);

// Connect to the database and start the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to database:', err);
});


