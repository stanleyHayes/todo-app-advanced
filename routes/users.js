const express = require("express");
const User = require("../models/User");
const advancedResults = require("../middlewares/advancedResult");
const {deleteUser, deleteUsers, getUser, getUsers, updateUser} = require("../controllers/users");
const {protect} = require("../middlewares/authentication");

const router = express.Router();

router.route("/")
    .get(advancedResults(User), getUsers)
    .delete(deleteUsers);

router.route("/:userId")
    .get(protect, getUser)
    .put(protect, updateUser)
    .delete(deleteUser);


module.exports = router;
