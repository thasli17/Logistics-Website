const express = require('express');
const app = express();
const path = require('path');
const admin = require('./routes/admin')
const user = require('./routes/user')
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

// Set 'views' directory for any views 
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (usually sent by forms)
app.use(express.urlencoded({ extended: true }));
// Set view engine as EJS
app.set('view engine', 'ejs');


app.use('/',user)
app.use('/admin',admin)


mongoose.connect('mongodb://0.0.0.0:27017/logis')
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server Started at http://localhost:${PORT}`);
    })
}).catch((e)=>{
    console.log('Error connecting to mongodb',e);
})

