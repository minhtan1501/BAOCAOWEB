const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim:true,
        unique: true,
    },


},{
    timestamps:true,
})

const categories = mongoose.model('categories',categorySchema);

module.exports = categories;