const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async function (req, res, next) {
    const {role, name, password, username, email} = req.body;

    let user = await User.findOne({email});
    if (user) {
        return next(new ErrorResponse("User with email already exists", 409));
    }

    user = await User.create({name, email, username, password, role});
    sendTokenResponse(user, 200, res);
});

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async function (req, res, next) {
    const {email, password} = req.body;

    //validate email
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    const user = await User.findOne({email: email}).select("+password");

    //check for user
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendTokenResponse(user, 200, res);
});


//@desc     Get currently logged in user
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = asyncHandler(async function (req, res, next) {
    const user = User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
});


//@desc     Change password
//@route    POST /api/v1/auth/change-password
//@access   Private
exports.changePassword = asyncHandler(async function (req, res, next) {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    let user = await User.findById(req.user.id).select("+password");
    const isMatch = user.matchPassword(currentPassword);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    user.password = newPassword;
    user.save();

    sendTokenResponse(user, 200, res);
});


//@desc     Reset password
//@route    PUT /api/v1/auth/reset-password
//@access   Public
exports.resetPassword = asyncHandler(async function (req, res, next) {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}});
    if (!user) {
        return next(
            new ErrorResponse("Invalid token", 400)
        )
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    user.save();
    sendTokenResponse(user, 200, res);
});

//@desc     Forgot Password
//@route    POST /api/v1/auth/forgotten-password
//@access   Public
exports.forgotPassword = asyncHandler(async function (req, res, next) {

    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new ErrorResponse(`No user with email ${req.body.email}`, 404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    //Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;
    const resetPasswordLink = `https://localhost:3000/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested reset of a password. Click on this link to reset password ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message
        });

        res.status(200).json({success: true, data: "Email sent"});
    } catch (e) {
        console.log(e);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.save({validateBeforeSave: false});

        return next(new ErrorResponse("Email could not be sent", 500));
    }

});


//Get token from model, create cookie and send response
const sendTokenResponse = function (user, statusCode, res) {
    const token = user.getSignedToken();
    const options = {
        expiresIn: new Date(new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({success: true, token})
};
