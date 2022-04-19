const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    price:{
        type: Number,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    images: {
        type: Object,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    checked:{
        type:  Boolean,
        default: false,
    },
    sold:{
        type: Number,
        default: 0,

    }
},{
    timestamps:true
})

const Product = mongoose.model('Product',productSchema);

module.exports = Product