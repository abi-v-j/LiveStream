const express = require("express"); 
const app = express(); 
const cors = require("cors");
const bodyParser = require("body-parser"); 
const port = 5000; 
const dotenv = require('dotenv');
dotenv.config









//use express static folder
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.listen(port, () => {
    try {
        console.log(`Server is running ${port}`);

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
