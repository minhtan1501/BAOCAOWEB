const mongoose = require("mongoose");

async function connect() {
  try {
    const URI = process.env.MONGODB_URL;
    await mongoose.connect(URI, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });
    console.log("connect successfully!");
  } catch (e) {
    console.log(e);
  }
}

module.exports = connect;
