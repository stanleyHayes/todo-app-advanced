const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

//@desc     Get all users
//@route    GET /api/v1/users
//@access   Private
exports.getUsers = asyncHandler(async function (req, res, next) {
    res.status(200).json(res.advancedResults);
});


//@desc     Get all users
//@route    GET /api/v1/users/:userId
//@access   Private
exports.getUser = asyncHandler(asyncHandler(async function (req, res, next) {
    const users = await User.find
}));


//@desc     Update user
//@route    PUT /api/v1/users/:userId
//@access   Private
exports.updateUser = asyncHandler(asyncHandler(async function (req, res, next) {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {new: true, runValidators: true});
    res.status(200).json({success: true, data: user});
}));

//@desc     Delete user
//@route    DELETE /api/v1/users/:userId
//@access   Private
exports.deleteUser = asyncHandler(asyncHandler(function (req, res, next) {

}));

//@desc     Delete all users
//@route    DELETE /api/v1/users
//@access   Private
exports.deleteUsers = asyncHandler(asyncHandler(async function (req, res, next) {
    await User.deleteMany({});
    return res.status(200).json({success: true, data: []})
}));


