const express = require('express');
const ExpressError = require("./expressError");
const routes = require("./routes");
const morgan = require("morgan");


const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use("/items", routes);

// generic 404 page that responds with json
app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404);
    next(e);
});

// Error handling middleware
app.use((error, req, res, next) => {
    // console.log("##### Error Handler #####");
    let status = error.status || 500;
    let message = error.message || 'Internal Server Error';
    res.status(status).json({ 
        error: { message, status }
    });
});
module.exports =app;