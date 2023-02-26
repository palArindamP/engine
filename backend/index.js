const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv')        //2//

const app = express();

////2// Create env file
// terminal command->   PS C:\first_project\backend> type null > config.env
dotenv.config({path: './config.env' });
require('./db/connection')

////6// To understand the json formated data
app.use(express.json());

////5// Use router filr
app.use(require('./router/routers'));

////4// Use the schema
const User = require('./model/userSchema')

////2// Process to connect with database.
// steps => 1> Create new project. 
//          2> After createing the clusters go to collections and click on 'add my own data'.
//          3> Click on connect to set the 'username' and 'password' and 'create database user'.
//          4> After those 'choose a method' and 'connect your application'.
const PORT = process.env.PORT;

////3// This portion is in connection.js file
const DB = process.env.DATABASE;
//const DB = `mongodb+srv://arindam:arindam@cluster0.uku0isl.mongodb.net/firstDatabase?retryWrites=true&w=majority`;
// mongoose.connect(DB 
// ,{
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true
//     // useFindAndModify: false
// }
// ).then(() =>{
//     console.log("connection done sucessfully")
// }).catch((err) => {
//     console.log(err)
// })


//1//// Middelware.
const middleware =(req, res, next)=>{
    console.log(`Hello Middleware`);
    next();
}






// app.get('/', (req, res) =>{
//     res.send('hello')
// })

app.get('/about',middleware, (req, res) =>{
    res.send('aboutPage')
})

app.get('/contact', (req, res) =>{
    res.cookie("test", 'pal')
    res.send('contactPage')
})

app.get('/signin', (req, res) =>{
    res.send('signinPage')
})

app.get('/signup', (req, res) =>{
    res.send('signupPage')
})



app.listen(PORT, () =>{
    console.log(`AT PORT ${PORT}`)
})