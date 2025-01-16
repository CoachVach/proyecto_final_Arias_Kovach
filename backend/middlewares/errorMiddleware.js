const errorMiddleware = (err, req, res, next) => {
    // Determinar el código de estado y el mensaje del error
    const statusCode = err.status || 500; // Por defecto, error interno del servidor
    const response = {
        error: {
            message: err.message || 'Error interno del servidor',
        },
    };

    // Incluir detalles si están disponibles
    if (err.details) {
        response.error.details = err.details;
    }

    // Incluir el stack trace solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
        console.error(`[Error Stack]: ${err.stack}`); // Log para debugging
    } else {
        console.error(`[Error]: ${err.message}`); // Log básico en producción
    }

    // Enviar la respuesta de error al cliente
    res.status(statusCode).json(response);
};

module.exports = {
    errorMiddleware
};