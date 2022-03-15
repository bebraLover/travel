const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema({
        username: {
            type: String,
            require: true,
        },
        title: {
            type: String,
            require: true,
            max: 50,
            unique: true
        },
        description: {
            type: String,
        },
        rating:{
            type:Number,
            min:0,
            max:5,
            require:true
        },
        lat:{
            type:Number,
            require:true,
        },
        long:{
            type:Number,
            require:true,
        }

    },
    {timestamps:true}
);
module.exports = mongoose.model("Pin",PinSchema);
