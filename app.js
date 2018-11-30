const express = require ('express');
const app =  express();
const validate = require('express-validator');
const bodyParser = require ("body-parser");
const cors = require ("cors");
const dbConfig = require ("./config/database");
const appConfig = require ("./config/application");
const mongoose = require ("mongoose");
const passport = require ("passport");
//connecting to mongo db
mongoose.connect(dbConfig.database);

mongoose.connection.on('connected',() => {
    console.log("database connected "+ dbConfig.database);
});

mongoose.connection.on('error',(err) => {
    console.log("Error while connecting to db: "+err);
});




// app.use(cors())

// app.use(cors())

// app.use(cors())


// app.use(cors())


app.use(cors())
// app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });

//  { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });

app.use(validate());
//body parser midleware
app.use(bodyParser.json());


// user module
// const users = require ('./controllers/users.js');
require('./routes')(app);
// app.use('/users',users);

//index route
app.get('/',(req,res)=>{
    res.status(200).send("HI this is home");
});

//start server
app.listen(process.env.PORT || 3000,function(){
    console.log("Server is listening on port ::");
});
// app.listen(process.env.port,function(){
//     console.log("Server is listening on port :: 1337" );
// });


