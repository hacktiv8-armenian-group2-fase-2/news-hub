require("dotenv").config();

const express = require('express');
const errHandler = require('./middlewares/errorHandler.js');
const cors = require('cors')
const app = express();
const PORT = 3000;
const routes = require('./routes/index.js');

app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/', routes)
app.use(errHandler);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})