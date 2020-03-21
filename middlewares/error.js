const ErrorResponse = require("../utils/errorResponse");

const errorHandler = function (err, req, res, next) {
    let error = {...err};

    console.log(error);
    //duplicate field error
    if (error.code === 11000) {
        const message = `Todo with the same title exists`;
        error = new ErrorResponse(message, 400)
    }
    error.message = err.message;
    //Mongoose bad ObjectId
    if (error.name === 'CastError') {
        const message = `Resource not found with an id of ${error.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(err.errors).map(function (value) {
            return value.message;
        });

        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500)
        .json({success: false, error: error.message || "Server Error"});
};

module.exports = errorHandler;
