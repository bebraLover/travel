const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');


dotenv.config();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('MONGODB CONNECTED');
}).catch((err)=>console.log(err));



app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);

app.listen(8800,()=>{
        console.log('SERVER STARTED');
})
