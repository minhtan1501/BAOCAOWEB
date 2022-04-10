const Payments = require("../models/paymentsModels");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const paymentsCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name email");

      if (!user)
        return res.status(400).json({ message: "User dose note exsit" });

      const { cart, paymentID, address } = req.body;
      const { _id, name, email } = user;
      const newPayment = new Payments({
          user_id: _id,name,email,cart,paymentID,address
      })

      cart.filter(item => {
        return sold(item.product._id, item.quantity,item.product.sold )
      })

      await newPayment.save();
      res.status(200).json({message: "Payment successfully"})

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const sold = async (id,quantity,oldSold) =>{
  await Product.findByIdAndUpdate({
    _id: id
  },{
    sold: quantity + oldSold
  })
}

module.exports = paymentsCtrl
