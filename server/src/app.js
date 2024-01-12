require('dotenv').config()
const express = require('express');
const router = require('./routes/routers');
const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(router)

app.listen(port, () => {
    console.log(`localhost:${port}!`);
});