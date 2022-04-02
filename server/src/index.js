require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const db = require('./config/connectdb');
const routes = require('./routes/index');
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({
    extends:true
}))
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles:true
}));

// connect database
db();
// routes
routes(app);


// listening
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`)
})