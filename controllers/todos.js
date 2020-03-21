const Todo = require("../models/Todo");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const path = require("path");

//@desc     Get all todos
//@route    GET /api/v1/todos
//@access   Private
exports.getTodos = asyncHandler(async function (req, res, next) {
    res.status(200).json(res.advancedResults);
});


//@desc     Get single todo
//@route    GET /api/v1/todos/:id
//@access   Private
exports.getTodo = asyncHandler(async function (req, res, next) {
    const todo = await Todo.findById(req.params.id);

    //if logged in user is not an admin or not owner of todo
    if (todo.owner !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }

    if (!todo) {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }
    res.status(200).json({success: true, data: todo,});
});

//@desc     Create new todo
//@route    POST /api/v1/todos
//@access   Private
exports.createTodo = asyncHandler(async function (req, res, next) {
    const todo = await Todo.create(req.body);
    res.status(201).json({success: true, data: todo})
});

//@desc     Update todo
//@route    POST /api/v1/todos/:id
//@access   Private
exports.updateTodo = asyncHandler(async function (req, res, next) {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }

    //if logged in user is not an admin or not owner of todo
    if (todo.owner !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    res.status(200).json({success: true, data: todo,});
});

//@desc     Delete new todo
//@route    POST /api/v1/todos/:id
//@access   Private
exports.deleteTodo = asyncHandler(async function (req, res, next) {
    let todo = await Todo.findById(req.params.id);

    //if logged in user is not an admin or not owner of todo
    if (todo.owner !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }

    if (!todo) {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }
    todo.remove();

    res.status(200).json({success: true, data: {}});
});

//@desc     Upload todo image
//@route    PUT /api/v1/todos/:id/image
//@access   Private

exports.uploadTodoImage = asyncHandler(async function (req, res, next) {
    if (!req.files.file) {
        return next(new ErrorResponse("Add an image file", 400));
    }

    let file = req.files.file;

    //check if file is image
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse("Upload an image file", 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Upload a file with size less than ${process.env.MAX_FILE_UPLOAD}`));
    }
    let todo = await Todo.findById(req.params.id);

    //if logged in user is not an admin or not owner of todo
    if (todo.owner !== req.user.id.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Todo with id ${req.params.id} not found on the server`, 404));
    }

    if (!todo) {
        return next(new ErrorResponse(`Todo with id of ${req.params.id} does not exist`, 404));
    }
    file.name = `TODO_${todo.title.replace(" ", "_").toLocaleUpperCase()}${path.parse(file.name).ext}`;

    file.mv(path.join(`${process.env.FILE_UPLOAD_PATH}/${file.name}`), function (error) {
        if (error) {
            return next(new ErrorResponse("Problem uploading file", 500));
        }
    });

    todo = await Todo.findByIdAndUpdate(req.params.id, {image: file.name}, {new: true});
    return res.status(200).json({success: true, data: todo})
});
