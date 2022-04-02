const Category = require('../models/categoryModel');


const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find({});

            res.json(categories);
        }
        catch (err) {
            return res.status(500).json({message:err.message});
        }
    },
    createCategory: async (req, res) => {
        try {
            // only admin can create, delele and update category;

            const {name} = req.body;
            const category = await Category.findOne({name});
            if(category) return res.status(400).json({message: "This category aldready exists"});
            const newCategory = new Category({name});

            await newCategory.save();
            res.status(200).json({message:"Created a category successfully"});
        }
        catch(err) {
            return res.status(500).json({message:err.message});
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);

            res.status(200).json({message: "Category deleted successfully"});
        }catch(err) {
            return res.status(500).json({message:err.message});
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id: req.params.id},{name: name});
            res.status(200).json({message:"Category updated successfully"});
        }catch(err) {
            return res.status(500).json({message:err.message});
        }
    }
}

module.exports = categoryCtrl;