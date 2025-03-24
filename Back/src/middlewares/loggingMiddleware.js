function loggingMiddleware(req, res, next) {
    console.log(`[Request] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
        console.log(`[Response] ${req.method} ${req.originalUrl} ${res.statusCode}`);
    });

    next();
}

module.exports = loggingMiddleware;