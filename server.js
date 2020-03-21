const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const errorHandler = require("./middlewares/error");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const path = require("path");


//Route files
const todos = require("./routes/todos");
const authentication = require("./routes/authentication");
const users = require("./routes/users");

//Load environment variables
dotenv.config({path: "./config/config.env"});

//connect to database
connectDb();

const app = express();
app.use(xss());
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json());
app.use(fileupload());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});

app.use(limiter);

app.use(hpp());
app.use(express.static(path.join(__dirname, 'public')));


//dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use("/api/v1/todos", todos);
app.use("/api/v1/auth", authentication);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function () {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

//handle unhandled promise rejections
process.on('unhandledRejection', function (error, promise) {
    console.log(`Error: ${error.message}`);
    //Close server and exit process
    server.close(function () {
        process.exit(1);
    })
});
