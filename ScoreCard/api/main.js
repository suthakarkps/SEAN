//importing modules
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const sql = require("msnodesqlv8");
const router = require('./router/router');

var app = express();

const PORT = 3000;

//adding middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);


function connectDB() {    

    const connectionString = "server=ctsincccvcsr04;Database=HEDIS_V10_02;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
    //const query = "SELECT name FROM sys.databases";
    const query="";
    console.log(sql)
    sql.query(connectionString, query, (err, rows) => {
        console.log(rows);
    });
}

connectDB();

app.get('/', (req, res) => {
    res.send("Hello world..!")
});

app.listen(PORT, () => {    
    console.log("server has been started in port" + PORT);    
})