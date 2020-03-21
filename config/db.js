const mongoose = require("mongoose");

const connectDB = async function () {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        autoIndex: false
    });
    console.log(`Server connected on host ${connection.connection.host}`);
};

module.exports = connectDB;
