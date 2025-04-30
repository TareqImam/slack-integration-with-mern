const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 