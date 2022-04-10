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
app.use(cors({credentials: true,  origin: 'http://localhost:3000'}));
app.use(fileUpload({
    useTempFiles:true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  });
// connect database
db();
// routes
routes(app);


// listening
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`)
})