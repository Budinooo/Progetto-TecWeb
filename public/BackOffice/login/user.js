//const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
    //module.exports = User