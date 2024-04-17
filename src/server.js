require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const errorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const userRoutes = require("./routes/user");
const bugRoutes = require("./routes/bugs");
const commentRoutes = require("./routes/comments");
const projectRoutes = require("./routes/projects");

const app=express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow all origins 

app.use(bodyParser.json());

app.get("/",(req  ,res , next )=>{
    try {
        sendResponse(res,true,"Hello World");
    } catch (err) {
        next(err);
    }
});

app.use("/user",userRoutes);
app.use("/bugs",bugRoutes);
app.use("/comments",commentRoutes);
app.use("/projects",projectRoutes);

app.use((err , req , res , next ) => {
    console.error(err.stack); // log error stack trace to console
    errorResponse(res, err);
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});