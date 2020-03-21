const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = asyncHandler(async function (req, res, next) {
    let token;
    //check for headers to find authorization and bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        next(new ErrorResponse("Unauthorized to access this route", 401));
    }

    //if token present, decode it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await User.findById(decoded.id);
        console.log(user);
        if (!user) {
            next(new ErrorResponse("Unauthorized to access this route", 401));
        }
        req.user = user;
        next();
    } catch (e) {
        next(new ErrorResponse("Unauthorized to access this route", 401));
    }
});


// exports.authorize = asyncHandler(function (...roles) {
//     return function (req, res, next) {
//         if(!roles.includes(req.user.role)){
//             next(new ErrorResponse("Unauthorized to access this route", 403));
//         }
//         next();
//     }
// });
