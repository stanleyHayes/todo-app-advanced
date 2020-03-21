const mongoose = require("mongoose");
const slugify = require("slugify");

const TodoSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User required'],
        ref: "User"
    },
    title: {
        type: String,
        required: [true, 'Title required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String
    },
    image: {
        type: String
    }
});

TodoSchema.pre('save', function (next) {
    this.slug = slugify(this.title, {lower: true});
    next()
});

const Todo = mongoose.model("todo", TodoSchema);

module.exports = Todo;
