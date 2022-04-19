const Products = require("../models/productModel");
const { ObjectId } = require("mongodb");
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((e) => delete queryObj[e]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/,
      (match) => "$" + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else {
      this.query.sort("price");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;
      const totalProducts = await Products.countDocuments();
      res.status(200).json({
        status: "success",
        results: totalProducts,
        products,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createProducts: async (req, res) => {
    try {
      const { title, price, description, images, category } = req.body;
      if (!images)
        return res.status(400).json({ message: "No images uploaded!" });
      const product = await Products.find();
      const check = product.findIndex(item => item.title === title)
      if (check >=0) {
        return res.status(400).json({ message: "Product already exists" });
      }
      const newProduct = new Products({
        title,
        price,
        description,
        images,
        category,
      });

      await newProduct.save();
      res.status(200).json({ message: "Create product successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ message: "Delete product successfully!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        images,
        category,
      } = req.body;
      if (!images) return res.status(400).json({ message: "No images upload" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          price,
          description,
          images,
          category,
        }
      );
      res.json({ message: "Updated a Product" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await Products.findById(id);
        if (!product)
          return res.status(404).json({ message: "Product not found." });
        return res.status(200).json(product);
      } else {
        return res.status(404).json({ message: "Product not found." });
      }
    } catch (err) {
      res.status(404).json({ error: err });
    }
  },
};

module.exports = productCtrl;
