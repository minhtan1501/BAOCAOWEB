const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const productRouter = require("./productRouter");
const upload = require("./upload");
const paymentRouter = require("./paymentRouter");
function routes(app) {
  // Router User
  app.use("/user", userRouter);
  app.use("/api", categoryRouter);
  app.use("/api", upload);
  app.use("/api", productRouter);
  app.use('/api',paymentRouter);
  app.use("/", (req, res) => {
    res.send("helo world");
  });
}

module.exports = routes;
