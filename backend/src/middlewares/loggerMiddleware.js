// src/middlewares/loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Call the next middleware function in the stack
};

module.exports = loggerMiddleware;
